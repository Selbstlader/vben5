<script setup lang="ts">
import { ref } from 'vue';

import { MarkdownEditor, Page } from '@vben/common-ui';

import changelog from '../../../../../../CHANGELOG.md?raw';

const content = ref(changelog);
</script>

<template>
  <Page :auto-content-height="true">
    <MarkdownEditor id="changelog" v-model:value="content" height="100%" />
  </Page>
</template>
