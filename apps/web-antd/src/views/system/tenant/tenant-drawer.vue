<script setup lang="ts">
import { computed, h, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { clientAdd, clientUpdate } from '#/api/system/client';
import { tenantInfo } from '#/api/system/tenant';
import { packageSelectList } from '#/api/system/tenant-package';

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
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

async function setupPackageSelect() {
  const tenantPackageList = await packageSelectList();
  const options = tenantPackageList.map((item) => ({
    label: h('div', { class: 'flex items-center gap-[6px]' }, [
      h('span', null, item.packageName),
      h(Tag, { color: 'processing' }, () => `${item.menuIds.length}个菜单项`),
    ]),
    title: item.packageName,
    value: item.packageId,
  }));
  formApi.updateSchema([
    {
      componentProps: {
        optionFilterProp: 'title',
        optionLabelProp: 'title',
        options,
        showSearch: true,
      },
      fieldName: 'packageId',
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
    await setupPackageSelect();
    if (update && id) {
      const record = await tenantInfo(id);
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
    <BasicForm />
  </BasicDrawer>
</template>

<style lang="scss" scoped>
:deep(.ant-divider) {
  margin: 8px 0;
}
</style>
