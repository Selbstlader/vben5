<script setup lang="tsx">
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { SocialInfo } from '#/api/system/social/model';

import { onMounted, ref } from 'vue';

import { Avatar, Modal, Table } from 'ant-design-vue';

import { authUnbinding } from '#/api';
import { socialList } from '#/api/system/social';

const columns: ColumnsType = [
  {
    align: 'center',
    dataIndex: 'source',
    title: '绑定平台',
  },
  {
    align: 'center',
    customRender: ({ value }) => {
      return <Avatar src={value} />;
    },
    dataIndex: 'avatar',
    title: '头像',
  },
  {
    align: 'center',
    dataIndex: 'userName',
    title: '账号',
  },
  {
    align: 'center',
    dataIndex: 'action',
    title: '操作',
  },
];

const tableData = ref<SocialInfo[]>([]);

async function reload() {
  tableData.value = await socialList();
}

onMounted(reload);

/**
 * 解绑账号
 */
function handleUnbind(record: Record<string, any>) {
  Modal.confirm({
    content: `确定解绑[${record.source}]平台的[${record.userName}]账号吗？`,
    async onOk() {
      await authUnbinding(record.id);
      await reload();
    },
    title: '提示',
    type: 'warning',
  });
}
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleUnbind(record)">解绑</a-button>
        </template>
      </template>
    </Table>
    <div>todo: 绑定功能</div>
  </div>
</template>
