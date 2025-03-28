<!--
不再支持url 统一使用ossId
去除使用`file-type`库进行文件类型检测 在Safari无法使用
-->
<script setup lang="ts">
import type { UploadListType } from 'ant-design-vue/es/upload/interface';

import { $t, I18nT } from '@vben/locales';

import { PlusOutlined } from '@ant-design/icons-vue';
import { Image, ImagePreviewGroup, Upload } from 'ant-design-vue';

import { defaultImageAcceptExts } from './helper';
import { useImagePreview, useUpload } from './hook';

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
   * 同antdv的listType
   * @default picture-card
   */
  listType?: UploadListType;
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
}

const props = withDefaults(defineProps<Props>(), {
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
  uploadUrl,
  headers,
  acceptFormat,
  handleChange,
  handleRemove,
  beforeUpload,
  innerFileList,
} = useUpload(props, ossIdList);

const { previewVisible, previewImage, handleCancel, handlePreview } =
  useImagePreview();
</script>

<template>
  <div>
    <Upload
      v-model:file-list="innerFileList"
      :list-type="listType"
      :action="uploadUrl"
      :headers="headers"
      :data="data"
      :accept="accept"
      :disabled="disabled"
      :max-count="maxCount"
      :progress="{ showInfo: true }"
      :multiple="multiple"
      :before-upload="beforeUpload"
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
    >
      <template #size>
        <span class="text-primary mx-1 font-medium"> {{ maxSize }}MB </span>
      </template>
      <template #ext>
        <span class="text-primary mx-1 font-medium">
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
</style>
