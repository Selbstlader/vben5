<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { LoginLog } from '#/api/monitor/logininfo/model';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Card, Space, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { loginInfoClean, loginInfoList } from '#/api/monitor/logininfo';
import { confirmDeleteModal } from '#/utils/modal';

import { columns, querySchema } from './data';
import loginInfoModal from './login-info-modal.vue';

const [LoginInfoModal, modalApi] = useVbenModal({
  connectedComponent: loginInfoModal,
});

const loginDataList = ref<LoginLog[]>([]);
async function reload() {
  const resp = await loginInfoList({ pageNum: 1, pageSize: 20 });
  loginDataList.value = resp.rows;
}

onMounted(reload);

function handlePreview(record: Recordable<any>) {
  modalApi.setData(record);
  modalApi.open();
}

function handleClear() {
  confirmDeleteModal({
    onValidated: async () => {
      await loginInfoClean();
    },
  });
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
  <Page content-class="flex flex-col gap-[6px]">
    <Card>
      <QueryForm />
    </Card>
    <div class="flex justify-end">
      <a-button @click="handleClear">{{ $t('pages.common.clear') }}</a-button>
    </div>
    <Table :columns="columns" :data-source="loginDataList" size="middle">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <Space>
            <a-button
              size="small"
              type="primary"
              @click="handlePreview(record)"
            >
              {{ $t('pages.common.info') }}
            </a-button>
          </Space>
        </template>
      </template>
    </Table>
    <LoginInfoModal />
  </Page>
</template>
