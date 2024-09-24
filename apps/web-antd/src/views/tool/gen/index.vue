<script setup lang="ts">
import type { Recordable } from '@vben/types';
import type { ColumnsType } from 'ant-design-vue/es/table';

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
    <Table :columns="columns" :data-source="dataSource" e="middle">
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
    <CodePreviewModal />
  </Page>
</template>
