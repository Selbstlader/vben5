import type { ExtendedFormApi } from '@vben/common-ui';
import type { MaybePromise } from '@vben/types';

import { ref } from 'vue';

import { $t } from '@vben/locales';

import { Modal } from 'ant-design-vue';
import { isFunction } from 'lodash-es';

interface BeforeCloseDiffProps {
  /**
   * 初始化值如何获取
   * @returns Promise<string>
   */
  initializedGetter: () => MaybePromise<string>;
  /**
   * 当前值如何获取
   * @returns Promise<string>
   */
  currentGetter: () => MaybePromise<string>;
  /**
   * 自定义比较函数
   * @param init 初始值
   * @param current 当前值
   * @returns boolean
   */
  compare?: (init: string, current: string) => boolean;
}

/**
 * @deprecated 注意为实验性功能 可能有api变动/被移除
 * @param props props
 * @returns hook
 *
 * 待解决问题: 网速慢情况直接关闭 会导致数据不一致问题
 * 但是使用api.lock会导致在报错情况无法关闭(因为目前代码没有finally)
 */
export function useBeforeCloseDiff(props: BeforeCloseDiffProps) {
  const { initializedGetter, currentGetter, compare } = props;
  const initialized = ref<string>('');
  const isInitialized = ref(false);
  const isSubmitted = ref(false);

  async function updateInitialized(data?: string) {
    initialized.value = data || (await initializedGetter());
    isInitialized.value = true;
  }

  function setSubmitted() {
    isSubmitted.value = true;
  }

  async function onBeforeClose(): Promise<boolean> {
    // 如果还未初始化，直接允许关闭
    if (!isInitialized.value) {
      return true;
    }
    // 如果已经提交过，直接允许关闭
    if (isSubmitted.value) {
      // 重置状态
      isSubmitted.value = false;
      return true;
    }

    try {
      const current = await currentGetter();

      if (isFunction(compare) && compare(initialized.value, current)) {
        return true;
      } else {
        // 如果数据没有变化，直接允许关闭
        if (current === initialized.value) {
          return true;
        }
      }

      // 数据有变化，显示确认对话框
      return new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: $t('pages.common.tip'),
          content: $t('您有未保存的更改，确认要退出吗？'),
          centered: true,
          okButtonProps: { danger: true },
          cancelText: $t('common.cancel'),
          okText: $t('common.confirm'),
          onOk: () => {
            resolve(true);
            isInitialized.value = false;
          },
          onCancel: () => resolve(false),
        });
      });
    } catch (error) {
      console.error('Failed to compare data:', error);
      return true;
    }
  }

  return {
    onBeforeClose,
    updateInitialized,
    setSubmitted,
  };
}

/**
 * 给useVbenForm使用的 封装函数
 * @param formApi 表单实例
 * @returns getter
 */
export function defaultFormValueGetter(formApi: ExtendedFormApi) {
  return async () => {
    const v = await formApi.getValues();
    return JSON.stringify(v);
  };
}
