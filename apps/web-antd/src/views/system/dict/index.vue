<script setup lang="ts">
import { Page } from '@vben/common-ui';

import DictDataPanel from './data/index.vue';
import DictTypePanel from './type/index.vue';
</script>

<template>
  <Page content-class="flex flex-col gap-[16px] lg:flex-row">
    <DictTypePanel class="flex-1" />
    <DictDataPanel class="flex-1" />
  </Page>
</template>
