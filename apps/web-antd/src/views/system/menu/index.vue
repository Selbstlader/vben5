<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import menuDrawer from './menu-drawer.vue';

const [MenuDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: menuDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">
      {{ $t('pages.common.add') }}
    </a-button>
    <MenuDrawer />
  </Page>
</template>
