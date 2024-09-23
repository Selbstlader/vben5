<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Space } from 'ant-design-vue';

import deptDrawer from './dept-drawer.vue';

const [DeptDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: deptDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

function handleTest(id: number | string) {
  drawerApi.setData({ id });
  drawerApi.open();
}
</script>

<template>
  <Page>
    <Space>
      <a-button type="primary" @click="handleAdd">
        {{ $t('pages.common.add') }}
      </a-button>
      <a-button @click="handleTest(103)"> 新增 上级id=103 </a-button>
      <a-button @click="handleTest(105)"> 新增 上级id=105 </a-button>
    </Space>
    <DeptDrawer />
  </Page>
</template>
