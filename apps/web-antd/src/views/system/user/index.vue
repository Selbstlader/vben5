<script setup lang="ts">
import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { userExport } from '#/api/system/user';
import { downloadExcel } from '#/utils/file/download';

import DeptTree from './dept-tree.vue';
import userDrawer from './user-drawer.vue';
import userImportModal from './user-import-modal.vue';

// 左边部门用
const selectDeptId = ref<string[]>([]);

function handleSelect() {
  console.log(selectDeptId.value);
  message.info(`选择了 ${selectDeptId.value.join(', ')}`);
}

const [UserImpotModal, userImportModalApi] = useVbenModal({
  connectedComponent: userImportModal,
});

function handleImport() {
  userImportModalApi.open();
}

const [UserDrawer, userDrawerApi] = useVbenDrawer({
  connectedComponent: userDrawer,
});

function handleAdd() {
  userDrawerApi.setData({ update: false });
  userDrawerApi.open();
}
</script>

<template>
  <Page content-class="flex gap-[8px]">
    <DeptTree
      v-model:select-dept-id="selectDeptId"
      :height="300"
      class="w-[260px]"
      @select="handleSelect"
    />
    <div class="flex gap-[8px]">
      <a-button
        v-access:code="['system:user:export']"
        @click="downloadExcel(userExport, '用户管理', {})"
      >
        {{ $t('pages.common.export') }}
      </a-button>
      <a-button v-access:code="['system:user:import']" @click="handleImport">
        {{ $t('pages.common.import') }}
      </a-button>
      <a-button
        type="primary"
        v-access:code="['system:user:add']"
        @click="handleAdd"
      >
        {{ $t('pages.common.add') }}
      </a-button>
    </div>
    <UserImpotModal />
    <UserDrawer />
  </Page>
</template>
