<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Tinymce } from '#/components/Tinymce';

const readonly = ref(false);
const content = ref('');
</script>

<template>
  <Page title="Tinymce富文本">
    <div class="flex flex-col gap-[16px]">
      <div class="flex items-center gap-[16px]">
        <span>只读</span>
        <a-switch v-model:checked="readonly" />
      </div>
      <Tinymce v-model:value="content" :options="{ readonly }" />
    </div>
  </Page>
</template>
