<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { addFullName } from '@vben/utils';

import { useVbenForm } from '#/adapter';
import { postAdd, postUpdate } from '#/api/system/post';
import { getDeptTree } from '#/api/system/user';

import { drawerSchema } from './data';

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
  commonConfig: {
    formItemClass: 'col-span-2',
  },
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

async function initDeptSelect() {
  const deptTree = await getDeptTree();
  // 选中后显示在输入框的值 即父节点 / 子节点
  addFullName(deptTree, 'label', ' / ');
  formApi.setState((prev) => {
    return {
      ...prev,
      schema: prev.schema?.map((item) => {
        // 部门树
        if (item.fieldName === 'deptId') {
          return {
            ...item,
            componentProps: {
              ...item.componentProps,
              fieldNames: { label: 'label', value: 'id' },
              treeData: deptTree,
              treeDefaultExpandAll: true,
              treeLine: { showLeafIcon: false },
              // 选中后显示在输入框的值
              treeNodeLabelProp: 'fullName',
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
    await initDeptSelect();
    // 更新 && 赋值
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
    await (isUpdate.value ? postUpdate(data) : postAdd(data));
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
    <BasicForm />
  </BasicDrawer>
</template>
