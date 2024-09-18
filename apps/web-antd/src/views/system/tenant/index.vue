<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import tenantDrawer from './tenant-drawer.vue';

const [TenantDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: tenantDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <a-button
      type="primary"
      v-access:code="['system:tenant:add']"
      @click="handleAdd"
    >
      {{ $t('pages.common.add') }}
    </a-button>
    <TenantDrawer />
  </Page>
</template>
