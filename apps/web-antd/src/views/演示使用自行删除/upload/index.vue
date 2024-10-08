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
</script>

<template>
  <Page content-class="flex flex-col gap-[12px]">
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
