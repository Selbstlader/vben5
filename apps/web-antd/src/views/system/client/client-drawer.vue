<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import { clientAdd, clientUpdate } from '#/api/system/client';

import { drawerSchema } from './data';
import SecretInput from './secret-input.vue';

const emit = defineEmits<{ reload: [] }>();

interface DrawerProps {
  update: boolean;
  record?: any;
}

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  layout: 'vertical',
  schema: drawerSchema(),
  showDefaultActions: false,
});

function setupForm(update: boolean, record?: any) {
  formApi.setState((prev) => {
    return {
      ...prev,
      schema: prev.schema?.map((item) => {
        if (item.fieldName === 'clientId') {
          return {
            ...item,
            dependencies: {
              show: () => update,
              triggerFields: [''],
            },
          };
        }
        if (
          item.fieldName === 'clientKey' ||
          item.fieldName === 'clientSecret'
        ) {
          return {
            ...item,
            componentProps: {
              ...item.componentProps,
              disabled: update,
            },
          };
        }
        if (item.fieldName === 'status') {
          return {
            ...item,
            componentProps: {
              ...item.componentProps,
              disabled: record?.id === 1,
            },
          };
        }
        return item;
      }),
    };
  });
}

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);
    const { record, update } = drawerApi.getData() as DrawerProps;
    isUpdate.value = update;
    // 初始化
    setupForm(update, record);
    if (update && record) {
      for (const key in record) {
        await formApi.setFieldValue(key, record[key]);
      }
    }
    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.drawerLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = await formApi.getValues();
    console.log(data);
    await (isUpdate.value ? clientUpdate(data) : clientAdd(data));
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
  <BasicDrawer :title="title" class="w-[600px]">
    <BasicForm>
      <template #clientSecret="slotProps">
        <SecretInput v-bind="slotProps" :disabled="isUpdate" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
