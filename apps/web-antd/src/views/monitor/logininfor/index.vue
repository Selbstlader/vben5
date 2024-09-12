<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { LoginLog } from '#/api/monitor/logininfo/model';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Space, Table } from 'ant-design-vue';

import { loginInfoList } from '#/api/monitor/logininfo';

import { columns } from './data';
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
</script>

<template>
  <Page>
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
