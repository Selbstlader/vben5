<script setup lang="ts">
import { Page, useVbenModal } from '@vben/common-ui';

import codePreviewModal from './code-preview-modal.vue';

const [CodePreviewModal, previewModalApi] = useVbenModal({
  connectedComponent: codePreviewModal,
});

function handlePreview() {
  previewModalApi.open();
}
</script>

<template>
  <Page>
    <a-button @click="handlePreview">代码预览</a-button>
    <CodePreviewModal />
  </Page>
</template>
