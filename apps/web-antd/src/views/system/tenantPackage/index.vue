<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import tenantPackageDrawer from './tenant-package-drawer.vue';

const [TenantPackageDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: tenantPackageDrawer,
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
    <TenantPackageDrawer />
  </Page>
</template>
