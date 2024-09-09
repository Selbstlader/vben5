<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { JsonPreview } from '#/components/code-editor';

const obj = {
  address: {
    a: 1,
    b: true,
  },
  age: 1234,
  name: 'ruoyi-plus',
};
</script>

<template>
  <Page>
    <Card title="json预览">
      <JsonPreview :data="obj" />
    </Card>
  </Page>
</template>
