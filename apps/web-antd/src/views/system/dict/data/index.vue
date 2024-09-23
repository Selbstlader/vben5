<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import dictDataDrawer from './dict-data-drawer.vue';

const [DictDataDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: dictDataDrawer,
});

function handleAdd() {
  drawerApi.setData({ dictType: 'aa_bb_cc' });
  drawerApi.open();
}
</script>

<template>
  <div>
    <a-button type="primary" @click="handleAdd">
      {{ $t('pages.common.add') }}
    </a-button>
    <DictDataDrawer />
  </div>
</template>
