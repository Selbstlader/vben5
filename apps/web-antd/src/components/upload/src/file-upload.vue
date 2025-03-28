<!--
不再支持url 统一使用ossId
去除使用`file-type`库进行文件类型检测 在Safari无法使用
-->
<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue';

import { computed } from 'vue';

import { $t, I18nT } from '@vben/locales';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { Upload } from 'ant-design-vue';

import { defaultFileAcceptExts, defaultFilePreview } from './helper';
import { useUpload } from './hook';

interface Props {
  /**
   * 文件上传失败 是否从展示列表中删除
   * @default true
   */
  removeOnError?: boolean;
  /**
   * 上传成功 是否展示提示信息
   * @default true
   */
  showSuccessMsg?: boolean;
  /**
   * 删除文件前是否需要确认
   * @default false
   */
  removeConfirm?: boolean;
  /**
   * 同antdv参数
   */
  accept?: string;
  /**
   * 附带的请求参数
   */
  data?: any;
  /**
   * 最大上传图片数量
   * maxCount为1时 会被绑定为string而非string[]
   * @default 1
   */
  maxCount?: number;
  /**
   * 文件最大 单位M
   * @default 5
   */
  maxSize?: number;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否显示文案 请上传不超过...
   * @default true
   */
  helpMessage?: boolean;
  /**
   * 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件。
   * @default false
   */
  multiple?: boolean;
  /**
   * 自定义文件预览逻辑 比如: 你可以改为下载
   * @param file file
   */
  preview?: (file: UploadFile) => Promise<void> | void;
  enableDragUpload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
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
});

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
  uploadUrl,
  headers,
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
      :action="uploadUrl"
      :headers="headers"
      :data="data"
      :accept="accept"
      :disabled="disabled"
      :max-count="maxCount"
      :progress="{ showInfo: true }"
      :multiple="multiple"
      :before-upload="beforeUpload"
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
