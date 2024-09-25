<script setup lang="ts">
import type { Recordable } from '@vben/types';
import type { ColumnsType } from 'ant-design-vue/es/table';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Card, Space, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { roleList } from '#/api/system/role';

import { querySchema } from './data';
import roleAuthModal from './role-auth-modal.vue';
import roleDrawer from './role-drawer.vue';

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

const [RoleDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: roleDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

const columns: ColumnsType = [
  {
    dataIndex: 'roleName',
    title: '角色名称',
  },
  {
    dataIndex: 'roleKey',
    title: '权限字符',
  },
  {
    dataIndex: 'dataScope',
    title: '数据权限',
  },
  {
    dataIndex: 'roleSort',
    title: '排序',
  },
  {
    dataIndex: 'status',
    title: '状态',
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    align: 'center',
    dataIndex: 'action',
    title: '操作',
  },
];

const dataSource = ref([]);
onMounted(async () => {
  const resp = await roleList();
  dataSource.value = (resp as any).rows;
});

function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.roleId });
  drawerApi.open();
}

const [RoleAuthModal, authModalApi] = useVbenModal({
  connectedComponent: roleAuthModal,
});

function handleAuthEdit(record: Recordable<any>) {
  authModalApi.setData({ id: record.roleId });
  authModalApi.open();
}
</script>

<template>
  <Page content-class="flex flex-col gap-[16px]">
    <Card class="flex-1">
      <QueryForm />
    </Card>
    <a-button @click="handleAdd">{{ $t('pages.common.add') }}</a-button>
    <RoleDrawer />
    <RoleAuthModal />
    <div class="bg-background rounded-lg p-[16px]">
      <Table :columns="columns" :data-source="dataSource">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <a-button size="small" type="primary" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button size="small" @click="handleAuthEdit(record)">
                数据权限
              </a-button>
            </Space>
          </template>
        </template>
      </Table>
    </div>
  </Page>
</template>
