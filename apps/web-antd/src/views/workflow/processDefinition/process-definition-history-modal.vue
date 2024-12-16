<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid, type VxeGridProps } from '@vben/plugins/vxe-table';

import { getHisListByKey } from '#/api/workflow/definition';

import { columns } from './data';

const [BasicModal, modalApi] = useVbenModal({
  title: '历史版本',
  class: 'w-[1000px]',
  footer: false,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    const { flowCode } = modalApi.getData() as { flowCode: string };
    const resp = await getHisListByKey(flowCode);
    // eslint-disable-next-line no-use-before-define
    await tableApi.grid.loadData(resp);
  },
});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'default',
  },
  columns: columns?.filter((item) => item.type !== 'checkbox'),
  height: 600,
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    isHover: true,
    keyField: 'id',
    height: 100,
  },
  toolbarConfig: {
    custom: false,
    zoom: false,
    refresh: false,
  },
  id: 'workflow-definition-history',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <BasicModal>
    <!-- TODO: 添加操作列 -->
    <BasicTable />
  </BasicModal>
</template>
