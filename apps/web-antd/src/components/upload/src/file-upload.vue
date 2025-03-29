<!--
不再支持url 统一使用ossId
去除使用`file-type`库进行文件类型检测 在Safari无法使用
-->
<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue';

import type { BaseUploadProps } from './props';

import { computed } from 'vue';

import { $t, I18nT } from '@vben/locales';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { Upload } from 'ant-design-vue';

import { uploadApi } from '#/api';

import { defaultFileAcceptExts, defaultFilePreview } from './helper';
import { useUpload } from './hook';

interface FileUploadProps extends BaseUploadProps {
  /**
   * 自定义文件预览逻辑 比如: 你可以改为下载
   * @param file file
   */
  preview?: (file: UploadFile) => Promise<void> | void;
  /**
   * 是否支持拖拽上传
   * @default false
   */
  enableDragUpload?: boolean;
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  api: () => uploadApi,
  removeOnError: true,
  showSuccessMsg: true,
  removeConfirm: false,
  accept: defaultFileAcceptExts.join(','),
  data: () => undefined,
  maxCount: 1,
  maxSize: 5,
  disabled: false,
  helpMessage: true,
  preview: defaultFilePreview,
  enableDragUpload: false,
  directory: false,
});

/** 返回不同的上传组件 */
const CurrentUploadComponent = computed(() => {
  if (props.enableDragUpload) {
    return Upload.Dragger;
  }
  return Upload;
});

// 双向绑定 ossId
const ossIdList = defineModel<string | string[]>('value', {
  default: () => [],
});

const {
  customRequest,
  acceptFormat,
  handleChange,
  handleRemove,
  beforeUpload,
  innerFileList,
} = useUpload(props, ossIdList);
</script>

<template>
  <div>
    <CurrentUploadComponent
      v-model:file-list="innerFileList"
      :accept="accept"
      :disabled="disabled"
      :directory="directory"
      :max-count="maxCount"
      :progress="{ showInfo: true }"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="preview"
      @change="handleChange"
      @remove="handleRemove"
    >
      <div v-if="!enableDragUpload && innerFileList?.length < maxCount">
        <a-button :disabled="disabled">
          <UploadOutlined />
          {{ $t('component.upload.upload') }}
        </a-button>
      </div>
      <div v-if="enableDragUpload && innerFileList?.length < maxCount">
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">
          {{ $t('component.upload.clickOrDrag') }}
        </p>
      </div>
    </CurrentUploadComponent>
    <slot name="helpMessage" v-bind="{ maxCount, disabled, maxSize, accept }">
      <I18nT
        v-if="helpMessage"
        scope="global"
        keypath="component.upload.uploadHelpMessage"
        tag="div"
        class="mt-2"
        :class="{ 'upload-text__disabled': disabled }"
      >
        <template #size>
          <span
            class="text-primary mx-1 font-medium"
            :class="{ 'upload-text__disabled': disabled }"
          >
            {{ maxSize }}MB
          </span>
        </template>
        <template #ext>
          <span
            class="text-primary mx-1 font-medium"
            :class="{ 'upload-text__disabled': disabled }"
          >
            {{ acceptFormat }}
          </span>
        </template>
      </I18nT>
    </slot>
  </div>
</template>

<style lang="scss">
// 禁用的样式和antd保持一致
.upload-text__disabled {
  color: rgb(50 54 57 / 25%);
  cursor: not-allowed;

  &:where(.dark, .dark *) {
    color: rgb(242 242 242 / 25%);
  }
}
</style>
