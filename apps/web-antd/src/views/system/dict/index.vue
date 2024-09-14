<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import DictTypePanel from './type/index.vue';
</script>

<template>
  <Page content-class="flex flex-col gap-[16px] lg:flex-row">
    <Card class="w-full">
      <DictTypePanel />
    </Card>
    <Card class="w-full">b</Card>
  </Page>
</template>
