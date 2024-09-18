<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import ossConfigDrawer from './oss-config-drawer.vue';

const [OssConfigDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: ossConfigDrawer,
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
    <OssConfigDrawer />
  </Page>
</template>
