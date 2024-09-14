<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import dictTypeModel from './dict-type-model.vue';

defineOptions({ name: 'DictTypePanel' });

const [DictTypeModal, modalApi] = useVbenModal({
  connectedComponent: dictTypeModel,
});

function handleAdd() {
  modalApi.setData({ update: false });
  modalApi.open();
}
</script>

<template>
  <div>
    <a-button type="primary" @click="handleAdd">
      {{ $t('pages.common.add') }}
    </a-button>
    <DictTypeModal />
  </div>
</template>
