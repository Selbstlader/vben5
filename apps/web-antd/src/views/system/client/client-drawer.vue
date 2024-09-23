<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import { clientAdd, clientInfo, clientUpdate } from '#/api/system/client';

import { drawerSchema } from './data';
import SecretInput from './secret-input.vue';

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
    formItemClass: 'col-span-2',
  },
  layout: 'vertical',
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

function setupForm(update: boolean) {
  formApi.updateSchema([
    {
      dependencies: {
        show: () => update,
        triggerFields: [''],
      },
      fieldName: 'clientId',
    },
    {
      componentProps: {
        disabled: update,
      },
      fieldName: 'clientKey',
    },
    {
      componentProps: {
        disabled: update,
      },
      fieldName: 'clientSecret',
    },
  ]);
}

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
    // 初始化
    setupForm(update);
    if (update && id) {
      const record = await clientInfo(id);
      // 不能禁用id为1的记录
      formApi.updateSchema([
        {
          componentProps: {
            disabled: record.id === 1,
          },
          fieldName: 'status',
        },
      ]);

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
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = await formApi.getValues();
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
  <BasicDrawer :close-on-click-modal="false" :title="title" class="w-[600px]">
    <BasicForm>
      <template #clientSecret="slotProps">
        <SecretInput v-bind="slotProps" :disabled="isUpdate" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<style lang="scss" scoped>
/**
自定义组件校验失败样式
*/
:deep(.form-valid-error .ant-input[name='clientSecret']) {
  border-color: hsl(var(--destructive));
  box-shadow: 0 0 0 2px rgb(255 38 5 / 6%);
}
</style>
