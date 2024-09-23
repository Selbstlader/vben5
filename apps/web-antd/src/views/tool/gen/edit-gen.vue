<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { genInfo } from '#/api/tool/gen';

const { setTabTitle } = useTabs();
const routes = useRoute();
const tableId = routes.params.tableId as string;

onMounted(async () => {
  const resp = await genInfo(tableId);
  console.log(resp);
  setTabTitle(`生成配置: ${resp.info.tableName}`);
});
</script>

<template>
  <Page>
    <div>修改代码生成</div>
    {{ tableId }}
  </Page>
</template>
