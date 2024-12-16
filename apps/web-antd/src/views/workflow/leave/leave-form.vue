<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Card } from 'ant-design-vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

import { useVbenForm } from '#/adapter/form';

import { leaveAdd, leaveInfo } from './api';
import { modalSchema } from './data';

const route = useRoute();
const readonly = route.query?.readonly === 'true';
const id = route.query?.id as string;

/**
 * id存在&readonly时候
 */
const showActionBtn = computed(() => {
  return id && !readonly;
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认占满两列
    formItemClass: 'col-span-2',
    // 默认label宽度 px
    labelWidth: 80,
    // 通用配置项 会影响到所有表单项
    componentProps: {
      class: 'w-full',
      disabled: readonly,
    },
  },
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

onMounted(async () => {
  // 只读 获取信息赋值
  if (id) {
    const resp = await leaveInfo(id);
    await formApi.setValues(resp);
    const dateRange = [dayjs(resp.startDate), dayjs(resp.endDate)];
    await formApi.setFieldValue('dateRange', dateRange);
  }
});

const router = useRouter();
async function handleTempSave() {
  try {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.getValues()) as any;
    // 处理日期
    data.startDate = dayjs(data.dateRange[0]).format('YYYY-MM-DD HH:mm:ss');
    data.endDate = dayjs(data.dateRange[1]).format('YYYY-MM-DD HH:mm:ss');
    await leaveAdd(data);
    router.push('/demo/leave');
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Card>
    <div id="leave-form">
      <BasicForm />
      <div v-if="showActionBtn" class="flex justify-end gap-2">
        <a-button @click="handleTempSave">暂存</a-button>
        <a-button type="primary">提交</a-button>
      </div>
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
