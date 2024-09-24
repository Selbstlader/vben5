<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Card } from 'ant-design-vue';
import { uniqueId } from 'lodash-es';

import { useVbenForm } from '#/adapter';

import { emitter } from '../mitt';
import { querySchema } from './data';
import dictTypeModel from './dict-type-model.vue';

defineOptions({ name: 'DictTypePanel' });

const [DictTypeModal, modalApi] = useVbenModal({
  connectedComponent: dictTypeModel,
});

function handleAdd() {
  modalApi.setData({ update: false });
  modalApi.open();
}

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: querySchema(),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    text: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function handleRowClickTest() {
  emitter.emit('rowClick', uniqueId('mitt-'));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <QueryForm />
    </Card>
    <Card>
      <a-button type="primary" @click="handleAdd">
        {{ $t('pages.common.add') }}
      </a-button>
    </Card>
    <Card>
      <a-button @click="handleRowClickTest">测试mitt</a-button>
      左侧向右侧传值
    </Card>
    <DictTypeModal />
  </div>
</template>
