<script setup lang="ts">
import { Page, useVbenModal } from '@vben/common-ui';

import noticeModal from './notice-modal.vue';

const [NoticeModal, modalApi] = useVbenModal({
  connectedComponent: noticeModal,
});

function handleAdd() {
  modalApi.setData({ update: false });
  modalApi.open();
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">新增</a-button>
    <NoticeModal />
  </Page>
</template>
