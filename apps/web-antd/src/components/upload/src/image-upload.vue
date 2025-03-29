<!--
不再支持url 统一使用ossId
去除使用`file-type`库进行文件类型检测 在Safari无法使用
-->
<script setup lang="ts">
import type { UploadListType } from 'ant-design-vue/es/upload/interface';

import type { BaseUploadProps } from './props';

import { $t, I18nT } from '@vben/locales';

import { PlusOutlined } from '@ant-design/icons-vue';
import { Image, ImagePreviewGroup, Upload } from 'ant-design-vue';

import { uploadApi } from '#/api';

import { defaultImageAcceptExts } from './helper';
import { useImagePreview, useUpload } from './hook';

interface ImageUploadProps extends BaseUploadProps {
  /**
   * 同antdv的listType
   * @default picture-card
   */
  listType?: UploadListType;
}

const props = withDefaults(defineProps<ImageUploadProps>(), {
  api: () => uploadApi,
  removeOnError: true,
  showSuccessMsg: true,
  removeConfirm: false,
  accept: defaultImageAcceptExts.join(','),
  data: () => undefined,
  maxCount: 1,
  maxSize: 5,
  disabled: false,
  listType: 'picture-card',
  helpMessage: true,
});

// 双向绑定 ossId
const ossIdList = defineModel<string | string[]>('value', {
  default: () => [],
});

const {
  acceptFormat,
  handleChange,
  handleRemove,
  beforeUpload,
  innerFileList,
  customRequest,
} = useUpload(props, ossIdList);

const { previewVisible, previewImage, handleCancel, handlePreview } =
  useImagePreview();
</script>

<template>
  <div>
    <Upload
      v-model:file-list="innerFileList"
      :list-type="listType"
      :accept="accept"
      :disabled="disabled"
      :directory="directory"
      :max-count="maxCount"
      :progress="{ showInfo: true }"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
      @change="handleChange"
      @remove="handleRemove"
    >
      <div v-if="innerFileList?.length < maxCount">
        <PlusOutlined />
        <div class="mt-[8px]">{{ $t('component.upload.upload') }}</div>
      </div>
    </Upload>
    <I18nT
      v-if="helpMessage"
      scope="global"
      keypath="component.upload.uploadHelpMessage"
      tag="div"
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
    <ImagePreviewGroup
      :preview="{
        visible: previewVisible,
        onVisibleChange: handleCancel,
      }"
    >
      <Image class="hidden" :src="previewImage" />
    </ImagePreviewGroup>
  </div>
</template>

<style lang="scss">
.ant-upload-select-picture-card {
  i {
    @apply text-[32px] text-[#999];
  }

  .ant-upload-text {
    @apply mt-[8px] text-[#666];
  }
}

.ant-upload-list-picture-card {
  .ant-upload-list-item::before {
    border-radius: 4px;
  }
}

// 禁用的样式和antd保持一致
.upload-text__disabled {
  color: rgb(50 54 57 / 25%);
  cursor: not-allowed;

  &:where(.dark, .dark *) {
    color: rgb(242 242 242 / 25%);
  }
}
</style>
