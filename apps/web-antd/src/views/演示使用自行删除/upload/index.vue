<script setup lang="ts">
import { ref } from 'vue';

import { JsonPreview, Page } from '@vben/common-ui';

import { RadioGroup } from 'ant-design-vue';

import { ImageUpload } from '#/components/upload';

const resultField = ref<'ossId' | 'url'>('ossId');

const fileList = ref([]);
const fieldOptions = [
  { label: 'ossId', value: 'ossId' },
  { label: '链接地址', value: 'url' },
];
</script>

<template>
  <Page class="flex flex-col gap-[8px]">
    <div class="bg-background flex flex-col gap-[12px] rounded-lg p-6">
      <div class="flex gap-[8px]">
        <span>返回字段: </span>
        <RadioGroup v-model:value="resultField" :options="fieldOptions" />
      </div>
      <ImageUpload v-model:value="fileList" :result-field="resultField" />
      <JsonPreview :data="fileList" />
    </div>
  </Page>
</template>
