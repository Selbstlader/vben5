<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import {
  ossConfigAdd,
  ossConfigInfo,
  ossConfigUpdate,
} from '#/api/system/oss-config';

import { drawerSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

interface DrawerProps {
  update: boolean;
  id?: number | string;
}

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-3',
    labelWidth: 100,
  },
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-3',
});

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);
    const { id, update } = drawerApi.getData() as DrawerProps;
    isUpdate.value = update;
    if (update && id) {
      const record = await ossConfigInfo(id);
      for (const key in record) {
        await formApi.setFieldValue(key, record[key as keyof typeof record]);
      }
    }
    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.drawerLoading(true);
    /**
     * 这里解构出来的values只能获取到自定义校验参数的值
     * 需要自行调用formApi.getValues()获取表单值
     */
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = await formApi.getValues();
    await (isUpdate.value ? ossConfigUpdate(data) : ossConfigAdd(data));
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    drawerApi.drawerLoading(false);
  }
}

async function handleCancel() {
  drawerApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicDrawer :close-on-click-modal="false" :title="title" class="w-[650px]">
    <BasicForm />
  </BasicDrawer>
</template>

<style lang="scss" scoped>
:deep(.ant-divider) {
  margin: 8px 0;
}
</style>
