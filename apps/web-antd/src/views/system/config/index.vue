<script setup lang="ts">
import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import configModal from './config-modal.vue';

const [ConfigModal, modalApi] = useVbenModal({
  connectedComponent: configModal,
});

function handleAdd() {
  modalApi.setData({ update: false });
  modalApi.open();
}

function reload() {
  message.success('reload test');
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">
      {{ $t('pages.common.add') }}
    </a-button>
    <ConfigModal @reload="reload" />
  </Page>
</template>
