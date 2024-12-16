<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { Card } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';

import { leaveInfo } from './api';
import { modalSchema } from './data';

const route = useRoute();
const disabled = route.query?.readonly === 'true';
const id = route.query?.id as string;

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认占满两列
    formItemClass: 'col-span-2',
    // 默认label宽度 px
    labelWidth: 80,
    // 通用配置项 会影响到所有表单项
    componentProps: {
      class: 'w-full',
      disabled,
    },
  },
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
  fieldMappingTime: [
    [
      'dateRange',
      ['startDate', 'endDate'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
});

onMounted(async () => {
  // 只读 获取信息赋值
  if (id && disabled) {
    const resp = await leaveInfo(id);
    await formApi.setValues(resp);
    const dateRange = [dayjs(resp.startDate), dayjs(resp.endDate)];
    await formApi.setFieldValue('dateRange', dateRange);
  }
});
</script>

<template>
  <Card>
    <div id="leave-form">
      <BasicForm />
    </div>
  </Card>
</template>

<style lang="scss">
/**
去除 '菜单加载中' 主要是iframe内嵌使用
*/
html:has(#leave-form) {
  .ant-message-notice-content:has(.ant-message-loading) {
    display: none;
  }
}
</style>
