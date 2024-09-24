<script setup lang="ts">
import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';

import { querySchema } from './data';
import menuDrawer from './menu-drawer.vue';

const [MenuDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: menuDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
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
    <Card>
      <div class="flex justify-end">
        <a-button type="primary" @click="handleAdd">
          {{ $t('pages.common.add') }}
        </a-button>
      </div>
    </Card>
    <MenuDrawer />
  </Page>
</template>
