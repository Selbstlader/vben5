<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';

import postDrawer from './post-drawer.vue';

const [PostDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: postDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">add</a-button>
    <PostDrawer />
  </Page>
</template>
