<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';

import clientDrawer from './client-drawer.vue';

const [ClientDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: clientDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">add</a-button>
    <ClientDrawer />
  </Page>
</template>
