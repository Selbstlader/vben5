<script setup lang="ts">
import type { Recordable } from '@vben/types';
import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Key } from 'ant-design-vue/es/table/interface';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { Card, message, Popconfirm, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { batchGenCode, generatedList, genRemove, syncDb } from '#/api/tool/gen';
import { downloadByData } from '#/utils/file/download';

import codePreviewModal from './code-preview-modal.vue';
import { querySchema } from './data';

const [CodePreviewModal, previewModalApi] = useVbenModal({
  connectedComponent: codePreviewModal,
});

const columns: ColumnsType = [
  {
    dataIndex: 'tableName',
    title: '表名称',
  },
  {
    dataIndex: 'tableComment',
    title: '表描述',
  },
  {
    dataIndex: 'className',
    title: '实体类',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    dataIndex: 'updateTime',
    title: '更新时间',
  },
  {
    align: 'center',
    dataIndex: 'action',
    title: '操作',
  },
];

const dataSource = ref([]);
onMounted(async () => {
  const resp = await generatedList({});
  dataSource.value = resp.rows;
});

function handlePreview(record: Recordable<any>) {
  previewModalApi.setData({ tableId: record.tableId });
  previewModalApi.open();
}

const router = useRouter();
function handleEdit(record: Recordable<any>) {
  router.push(`/code-gen/edit/${record.tableId}`);
}

async function handleSync(record: Recordable<any>) {
  await syncDb(record.tableId);
  // reload
}

const selectedRowKeys = ref<string[]>([]);
function handleSelectChange(selectedKeys: Key[]) {
  selectedRowKeys.value = selectedKeys as string[];
}

/**
 * 批量生成代码
 */
async function handleBatchGen() {
  if (selectedRowKeys.value.length === 0) {
    message.info('请选择需要生成代码的表');
    return;
  }
  const hideLoading = message.loading('下载中...');
  try {
    const params = selectedRowKeys.value.join(',');
    const data = await batchGenCode(params);
    const timestamp = Date.now();
    downloadByData(data, `批量代码生成_${timestamp}.zip`);
  } finally {
    hideLoading();
  }
}

async function handleDownload(record: Recordable<any>) {
  const hideLoading = message.loading('下载中...');
  try {
    const blob = await batchGenCode(record.tableId);
    const filename = `代码生成_${record.tableName}_${new Date().toLocaleString()}.zip`;
    downloadByData(blob, filename);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

/**
 * 删除
 * @param record
 */
async function handleDelete(record: Recordable<any>) {
  await genRemove(record.tableId);
  // reload
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
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
});
</script>

<template>
  <Page content-class="flex flex-col gap-4">
    <Card>
      <QueryForm />
    </Card>
    <Card
      :body-style="{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }"
    >
      <div class="flex justify-between">
        <span class="text-lg font-bold">代码生成列表</span>
        <div class="flex gap-[8px]">
          <a-button
            :disabled="selectedRowKeys.length === 0"
            danger
            type="primary"
          >
            删除
          </a-button>
          <a-button
            :disabled="selectedRowKeys.length === 0"
            @click="handleBatchGen"
          >
            {{ $t('pages.common.generate') }}
          </a-button>
          <a-button type="primary">
            {{ $t('pages.common.import') }}
          </a-button>
        </div>
      </div>
      <Table
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
        row-key="tableId"
        size="middle"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'action'">
            <a-button size="small" type="link" @click="handlePreview(record)">
              {{ $t('pages.common.preview') }}
            </a-button>
            <a-button size="small" type="link" @click="handleEdit(record)">
              {{ $t('pages.common.edit') }}
            </a-button>
            <Popconfirm
              :title="`确认同步[${record.tableName}]?`"
              placement="left"
              @confirm="handleSync(record)"
            >
              <a-button size="small" type="link">
                {{ $t('pages.common.sync') }}
              </a-button>
            </Popconfirm>
            <a-button size="small" type="link" @click="handleDownload(record)">
              生成代码
            </a-button>
            <Popconfirm
              :title="`确认删除[${record.tableName}]?`"
              placement="left"
              @confirm="handleDelete(record)"
            >
              <a-button danger size="small" type="link">
                {{ $t('pages.common.delete') }}
              </a-button>
            </Popconfirm>
          </template>
        </template>
      </Table>
    </Card>

    <CodePreviewModal />
  </Page>
</template>
