/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import type { FileType } from 'ant-design-vue/es/upload/interface';

import type { ModelRef } from 'vue';

import type { HttpResponse } from '@vben/request';

import type { UploadResult } from '#/api';
import type { OssFile } from '#/api/system/oss/model';

import { computed, ref, watch } from 'vue';

import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { message, Modal } from 'ant-design-vue';

import { ossInfo } from '#/api/system/oss';

/**
 * 图片预览hook
 * @returns 预览
 */
export function useImagePreview() {
  /**
   * 获取base64字符串
   * @param file 文件
   * @returns base64字符串
   */
  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', (error) => reject(error));
    });
  }

  // Modal可见
  const previewVisible = ref(false);
  // 预览的图片 url/base64
  const previewImage = ref('');
  // 预览的图片名称
  const previewTitle = ref('');

  function handleCancel() {
    previewVisible.value = false;
    previewTitle.value = '';
  }

  async function handlePreview(file: UploadFile) {
    if (!file) {
      return;
    }
    // 文件预览 取base64
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    // 这里不可能为空
    const url = file.url ?? '';
    previewImage.value = url || file.preview || '';
    previewVisible.value = true;
    previewTitle.value =
      file.name || url.slice(Math.max(0, url.lastIndexOf('/') + 1));
  }

  return {
    previewVisible,
    previewImage,
    previewTitle,
    handleCancel,
    handlePreview,
  };
}

/**
 * 图片上传和文件上传的通用hook
 * @param props 组件props
 * @param bindValue 双向绑定的idList
 * @returns hook
 */
export function useUpload(
  props: Readonly<BaseUploadProps>,
  bindValue: ModelRef<string | string[]>,
) {
  const { apiURL, clientId } = useAppConfig(
    import.meta.env,
    import.meta.env.PROD,
  );

  // 内部维护fileList
  const innerFileList = ref<UploadFile[]>([]);

  /** oss上传地址 */
  const uploadUrl = `${apiURL}/resource/oss/upload`;

  const accessStore = useAccessStore();

  /**
   * header参数 需要带上token和clientId
   */
  const headers = computed(() => {
    return {
      Authorization: `Bearer ${accessStore.accessToken}`,
      clientId,
    };
  });

  const acceptFormat = computed(() => {
    return props.accept
      ?.split(',')
      .map((item) => {
        if (item.startsWith('.')) {
          return item.slice(1);
        }
        return item;
      })
      .join(', ');
  });

  function handleChange(info: UploadChangeParam) {
    function removeCurrentFile(
      currentFile: UploadChangeParam['file'],
      currentFileList: UploadChangeParam['fileList'],
    ) {
      if (props.removeOnError) {
        currentFileList.splice(currentFileList.indexOf(currentFile), 1);
      } else {
        currentFile.status = 'error';
      }
    }

    const { file: currentFile, fileList } = info;

    switch (currentFile.status) {
      // 上传成功 只是判断httpStatus 200 需要手动判断业务code
      case 'done': {
        if (!currentFile.response) {
          return;
        }
        // 获取返回结果
        const response = currentFile.response as HttpResponse<UploadResult>;
        // 上传异常
        if (response.code !== 200) {
          message.error(response.msg);
          removeCurrentFile(currentFile, fileList);
          return;
        }
        // 上传成功 做转换
        if (props.showSuccessMsg) {
          message.success($t('component.upload.uploadSuccess'));
        }
        const { ossId, fileName, url } = response.data;
        currentFile.url = url;
        currentFile.fileName = fileName;
        currentFile.uid = ossId;
        // ossID添加 单个文件会被当做string
        if (props.maxCount === 1) {
          bindValue.value = ossId;
        } else {
          (bindValue.value as string[]).push(ossId);
        }
        break;
      }
      // 上传失败 网络原因导致httpStatus 不等于200
      case 'error': {
        message.error($t('component.upload.uploadError'));
        removeCurrentFile(currentFile, fileList);
      }
    }
  }

  function handleRemove(currentFile: UploadFile) {
    function remove() {
      // fileList会自行处理删除 这里只需要处理ossId
      if (props.maxCount === 1) {
        bindValue.value = '';
      } else {
        (bindValue.value as string[]).splice(
          bindValue.value.indexOf(currentFile.uid),
          1,
        );
      }
    }

    if (!props.removeConfirm) {
      remove();
      return true;
    }

    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: $t('pages.common.tip'),
        content: $t('component.upload.confirmDelete', [currentFile.name]),
        okButtonProps: { danger: true },
        centered: true,
        onOk() {
          resolve(true);
          remove();
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  }

  function beforeUpload(file: FileType) {
    const isLtMax = file.size / 1024 / 1024 < props.maxSize!;
    if (!isLtMax) {
      message.error($t('component.upload.maxSize', [props.maxSize]));
      return false;
    }
    // 大坑 Safari不支持file-type库 去除文件类型的校验
    return file;
  }

  /**
   * 这里只监听list地址变化 即重新赋值才会触发watch
   * immediate用于初始化触发
   */
  watch(
    () => bindValue.value,
    async (value) => {
      if (value.length === 0) {
        return;
      }
      const resp = await ossInfo(value);
      function transformFile(info: OssFile) {
        const fileitem: UploadFile = {
          uid: info.ossId,
          name: info.originalName,
          fileName: info.originalName,
          url: info.url,
          status: 'done',
        };
        return fileitem;
      }
      innerFileList.value = resp.map((item) => transformFile(item));
    },
    { immediate: true },
  );

  return {
    uploadUrl,
    headers,
    handleChange,
    handleRemove,
    beforeUpload,
    innerFileList,
    acceptFormat,
  };
}
