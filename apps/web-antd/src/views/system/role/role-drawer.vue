<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import { roleMenuTreeSelect } from '#/api/system/menu';
import { roleAdd, roleInfo, roleUpdate } from '#/api/system/role';

import { drawerSchema } from './data';
import MenuSelect from './menu-select.vue';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
  },
  layout: 'vertical',
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

async function setupMenuTree(id: number | string) {
  const resp = await roleMenuTreeSelect(id);
  console.log(resp);
  formApi.setFieldValue('menuIds', resp.checkedKeys);
}

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);
    const { id } = drawerApi.getData() as { id?: number | string };
    isUpdate.value = !!id;
    if (isUpdate.value && id) {
      const record = await roleInfo(id);
      for (const key in record) {
        await formApi.setFieldValue(key, record[key as keyof typeof record]);
      }
      // 设置选中的菜单
      await setupMenuTree(id);
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
    await (isUpdate.value ? roleUpdate(data) : roleAdd(data));
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

async function test() {
  const data = await formApi.getValues();
  console.log(data);
}
</script>

<template>
  <BasicDrawer :close-on-click-modal="false" :title="title" class="w-[600px]">
    <BasicForm>
      <template #menuIds="slotProps">
        <MenuSelect v-bind="slotProps" />
      </template>
    </BasicForm>
    <a-button @click="test">测试</a-button>
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
