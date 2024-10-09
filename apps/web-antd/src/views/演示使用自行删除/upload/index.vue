<script setup lang="ts">
import { ref } from 'vue';

import { JsonPreview, Page } from '@vben/common-ui';

import { Alert, RadioGroup } from 'ant-design-vue';

import { FileUpload, ImageUpload } from '#/components/upload';

const resultField = ref<'ossId' | 'url'>('ossId');

const imageList = ref([]);
const fileList = ref([]);
const fieldOptions = [
  { label: 'ossId', value: 'ossId' },
  { label: '链接地址', value: 'url' },
];
const fileAccept = ['txt', 'excel', 'word', 'pdf'];

const signleImage = ref<string>('');
</script>

<template>
  <Page content-class="flex flex-col gap-[12px]">
    <div class="bg-background flex flex-col gap-[12px] rounded-lg p-6">
      <Alert
        :show-icon="true"
        message="新特性: 单张图片会被绑定为string而非string[]类型 省去手动转换"
      />
      <ImageUpload v-model:value="signleImage" :max-number="1" />
      <Alert
        :show-icon="true"
        message="默认给空字符串会被转为[], 上传之后为正常string类型"
      />
      <JsonPreview :data="signleImage" />
    </div>
    <div class="bg-background flex flex-col gap-[12px] rounded-lg p-6">
      <div class="flex gap-[8px]">
        <span>返回字段: </span>
        <RadioGroup v-model:value="resultField" :options="fieldOptions" />
      </div>
      <ImageUpload v-model:value="imageList" :result-field="resultField" />
      <JsonPreview :data="imageList" />
    </div>
    <div class="bg-background flex flex-col gap-[12px] rounded-lg p-6">
      <div class="flex gap-[8px]">
        <span>返回字段: </span>
        <RadioGroup v-model:value="resultField" :options="fieldOptions" />
      </div>
      <Alert
        :message="`支持的文件类型：${fileAccept.join(', ')}`"
        :show-icon="true"
        type="info"
      />
      <FileUpload
        v-model:value="fileList"
        :accept="fileAccept"
        :result-field="resultField"
      />
      <JsonPreview :data="fileList" />
    </div>
  </Page>
</template>
