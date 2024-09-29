<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { configInfoByKey } from '#/api/system/config';

import { querySchema } from './data';

const router = useRouter();

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

const preview = ref(false);
onMounted(async () => {
  const resp = await configInfoByKey('sys.oss.previewListResource');
  preview.value = Boolean(resp);
});
</script>

<template>
  <Page>
    <Card>
      <QueryForm />
    </Card>
    <div class="flex items-center gap-2">
      <span>预览图片: </span>
      <Switch v-model:checked="preview" />
    </div>
    <a-button @click="() => router.push('/system/oss-config')">配置</a-button>
  </Page>
</template>
