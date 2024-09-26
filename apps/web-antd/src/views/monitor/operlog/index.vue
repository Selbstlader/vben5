<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { OperationLog } from '#/api/monitor/operlog/model';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Card, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { operLogList } from '#/api/monitor/operlog';

import { columns, querySchema } from './data';
import operationPreviewDrawer from './OperationPreviewDrawer.vue';

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
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
});

const dataSource = ref<OperationLog[]>([]);

onMounted(async () => {
  const resp = await operLogList({ pageNum: 1, pageSize: 30 });
  dataSource.value = resp.rows;
});

const [OperationPreviewDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: operationPreviewDrawer,
});

function handlePreview(record: Recordable<any>) {
  drawerApi.setData({ record });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>
    <div class="bg-background"></div>
    <Table :columns="columns" :data-source="dataSource">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'action'">
          <a-button size="small" type="link" @click="handlePreview(record)">
            {{ $t('pages.common.preview') }}
          </a-button>
        </template>
      </template>
    </Table>
    <OperationPreviewDrawer />
  </Page>
</template>
