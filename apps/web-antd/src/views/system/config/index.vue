<script setup lang="ts">
import type { Recordable } from '@vben/types';
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { Config } from '#/api/system/config/model';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { Card, Space, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { configExport, configList } from '#/api/system/config';
import { downloadExcel } from '#/utils/file/download';
import { renderDict } from '#/utils/render';

import configModal from './config-modal.vue';
import { querySchema } from './data';

const [ConfigModal, modalApi] = useVbenModal({
  connectedComponent: configModal,
});

function handleAdd() {
  modalApi.setData({});
  modalApi.open();
}

async function handleEdit(record: Recordable<any>) {
  modalApi.setData({ id: record.configId });
  modalApi.open();
}

const configDataList = ref<Config[]>([]);
async function reload() {
  const resp = await configList();
  configDataList.value = resp.rows;
}

onMounted(reload);

const columns: ColumnsType = [
  {
    align: 'center',
    dataIndex: 'configName',
    title: '参数名称',
  },
  {
    align: 'center',
    dataIndex: 'configKey',
    title: '参数KEY',
  },
  {
    align: 'center',
    dataIndex: 'configValue',
    title: '参数Value',
  },
  {
    align: 'center',
    customRender: ({ value }) => {
      return renderDict(value, DictEnum.SYS_YES_NO);
    },
    dataIndex: 'configType',
    title: '系统内置',
  },
  {
    align: 'center',
    dataIndex: 'remark',
    ellipsis: true,
    title: '备注',
  },
  {
    align: 'center',
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    align: 'center',
    dataIndex: 'action',
    title: '操作',
  },
];

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
</script>

<template>
  <Page content-class="flex flex-col gap-3">
    <Card>
      <QueryForm />
    </Card>
    <div class="flex justify-end gap-[8px]">
      <a-button @click="downloadExcel(configExport, '参数配置', {})">
        {{ $t('pages.common.export') }}
      </a-button>
      <a-button type="primary" @click="handleAdd">
        {{ $t('pages.common.add') }}
      </a-button>
    </div>
    <Table :columns :data-source="configDataList" size="middle">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <Space>
            <a-button size="small" type="primary" @click="handleEdit(record)">
              {{ $t('pages.common.edit') }}
            </a-button>
          </Space>
        </template>
      </template>
    </Table>
    <ConfigModal @reload="reload" />
  </Page>
</template>
