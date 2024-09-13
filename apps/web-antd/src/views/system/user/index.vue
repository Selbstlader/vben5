<script setup lang="ts">
import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { userExport } from '#/api/system/user';
import { downloadExcel } from '#/utils/file/download';

import userImportModal from './user-import-modal.vue';

const [UserImpotModal, userImportModalApi] = useVbenModal({
  connectedComponent: userImportModal,
});

function handleImport() {
  userImportModalApi.open();
}
</script>

<template>
  <Page>
    <div class="flex gap-[8px]">
      <a-button @click="downloadExcel(userExport, '用户管理', {})">
        {{ $t('pages.common.export') }}
      </a-button>
      <a-button @click="handleImport">{{ $t('pages.common.import') }}</a-button>
    </div>
    <UserImpotModal />
  </Page>
</template>
