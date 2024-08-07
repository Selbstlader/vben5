/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';
import { isString } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { isEmpty, isNull } from 'lodash-es';

import { useAuthStore } from '#/store';
import {
  decryptBase64,
  decryptWithAes,
  encryptBase64,
  encryptWithAes,
  generateAesKey,
} from '#/utils/encryption/crypto';
import * as encryptUtil from '#/utils/encryption/jsencrypt';

import { formatRequestDate, joinTimestamp, setObjToUrlParams } from './helper';

const { apiURL, clientId, enableEncrypt } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

/** 控制是否弹窗 防止登录超时请求多个api会弹窗多次 */
let showTimeoutToast = true;

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    // 后端地址
    baseURL,
    // 消息提示类型
    errorMessageMode: 'message',
    // 格式化提交参数时间
    formatDate: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    //  是否加入时间戳
    joinTime: false,
    // 为每个请求携带 Authorization
    makeAuthorization: () => {
      return {
        // 默认
        key: 'Authorization',
        tokenHandler: () => {
          const accessStore = useAccessStore();
          return {
            refreshToken: `${accessStore.refreshToken}`,
            token: `${accessStore.accessToken}`,
          };
        },
        unAuthorizedHandler: async () => {
          const accessStore = useAccessStore();
          const authStore = useAuthStore();
          accessStore.setAccessToken(null);

          if (preferences.app.loginExpiredMode === 'modal') {
            accessStore.setLoginExpired(true);
          } else {
            // 退出登录
            await authStore.logout();
          }
        },
      };
    },
    /**
     * http状态码不为200会走到这里
     * 其他会走到addResponseInterceptor
     * @param msg
     * @returns void
     */
    makeErrorMessage: (msg) => message.error(msg),

    makeRequestHeaders: () => {
      /**
       * locale跟后台不一致 需要转换
       */
      const language = preferences.app.locale.replace('-', '_');
      return {
        // 为每个请求携带 Accept-Language
        'Accept-Language': language,
        clientId,
      };
    },
  });

  client.addRequestInterceptor((config) => {
    const { encrypt, formatDate, joinParamsToUrl, joinTime = true } = config;
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === 'GET') {
      if (isString(params)) {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      } else {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false),
        );
      }
    } else {
      if (isString(params)) {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      } else {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      }
    }
    console.log('请求参数', config);
    // 全局开启 && 该请求开启 && 是post/put请求
    if (
      enableEncrypt &&
      encrypt &&
      ['POST', 'PUT'].includes(config.method?.toUpperCase() || '')
    ) {
      const aesKey = generateAesKey();
      config.headers['encrypt-key'] = encryptUtil.encrypt(
        encryptBase64(aesKey),
      );

      config.data =
        typeof config.data === 'object'
          ? encryptWithAes(JSON.stringify(config.data), aesKey)
          : encryptWithAes(config.data, aesKey);
    }
    return config;
  });

  client.addResponseInterceptor<HttpResponse>((response) => {
    const encryptKey = (response.headers || {})['encrypt-key'];
    if (encryptKey) {
      /** RSA私钥解密 拿到解密秘钥的base64 */
      const base64Str = encryptUtil.decrypt(encryptKey);
      /** base64 解码 得到请求头的 AES 秘钥 */
      const aesSecret = decryptBase64(base64Str.toString());
      /** 使用aesKey解密 responseData */
      const decryptData = decryptWithAes(
        response.data as unknown as string,
        aesSecret,
      );
      /** 赋值 需要转为对象 */
      response.data = JSON.parse(decryptData);
    }

    const { isReturnNativeResponse, isTransformResponse } = response.config;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return response;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return response.data;
    }

    const axiosResponseData = response.data;
    if (!axiosResponseData) {
      throw new Error($t('fallback.http.apiRequestFailed'));
    }

    //  ruoyi-plus没有采用严格的{code, msg, data}模式
    const { code, data, msg, ...other } = axiosResponseData;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = Reflect.has(axiosResponseData, 'code') && code === 200;
    if (hasSuccess) {
      let successMsg = msg;

      if (isNull(successMsg) || isEmpty(successMsg)) {
        successMsg = $t(`fallback.http.operationSuccess`);
      }

      if (response.config.successMessageMode === 'modal') {
        Modal.success({
          content: successMsg,
          title: $t('fallback.http.successTip'),
        });
      } else if (response.config.successMessageMode === 'message') {
        message.success(successMsg);
      }
      // ruoyi-plus没有采用严格的{code, msg, data}模式
      // 如果有data 直接返回data 没有data将剩余参数(...other)封装为data返回
      // 需要考虑data为null的情况(比如查询为空)
      if (data !== undefined) {
        return data;
      }
      return other;
    }
    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case 401: {
        const _msg = '登录超时, 请重新登录';
        const userStore = useAuthStore();
        userStore.logout().then(() => {
          /** 只弹窗一次 */
          if (showTimeoutToast) {
            showTimeoutToast = false;
            message.error(_msg);
            /** 定时器 3s后再开启弹窗 */
            setTimeout(() => {
              showTimeoutToast = true;
            }, 3000);
          }
        });
        // 不再执行下面逻辑
        return;
      }
      default: {
        if (msg) {
          timeoutMsg = msg;
        }
      }
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (response.config.errorMessageMode === 'modal') {
      Modal.error({
        content: timeoutMsg,
        title: $t('fallback.http.errorTip'),
      });
    } else if (response.config.errorMessageMode === 'message') {
      message.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || $t('fallback.http.apiRequestFailed'));
  });
  return client;
}

export const requestClient = createRequestClient(apiURL);
