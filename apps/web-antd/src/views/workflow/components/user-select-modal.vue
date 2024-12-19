<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import type { User } from '#/api';

import { ref } from 'vue';

import { useVbenModal, type VbenFormProps } from '@vben/common-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { userList } from '#/api/system/user';
import DeptTree from '#/views/system/user/dept-tree.vue';

defineOptions({
  name: 'UserSelectModal',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{ mode?: 'multiple' | 'single' }>(), {
  mode: 'multiple',
});

const emit = defineEmits<{
  finish: [User[]];
}>();

const [BasicModal, modalApi] = useVbenModal({
  title: '选择人员',
  class: 'w-[1050px]',
  fullscreenButton: false,
  onConfirm: handleSubmit,
  async onOpened() {
    const { userList = [] } = modalApi.getData() as { userList: User[] };
    // 暂时只处理多选 目前并没有单选的情况
    if (props.mode === 'multiple') {
      // 左边选中
      await tableApi.grid.setCheckboxRow(userList, true);
      // 右边赋值
      await rightTableApi.grid.loadData(userList);
    }
  },
});

// 左边部门用
const selectDeptId = ref<string[]>([]);
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'userName',
      label: '用户账号',
      hideLabel: true,
      componentProps: {
        placeholder: '请输入账号',
      },
    },
  ],
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-2',
  handleReset: async () => {
    selectDeptId.value = [];
    const { formApi, reload } = tableApi;
    await formApi.resetForm();
    const formValues = formApi.form.values;
    formApi.setLatestSubmissionValues(formValues);
    await reload(formValues);
  },
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'row',
  },
  radioConfig: {
    trigger: 'row',
    strict: true,
  },
  columns: [
    { type: props.mode === 'single' ? 'radio' : 'checkbox', width: 60 },
    {
      field: 'userName',
      title: '名称',
      width: 80,
    },
    {
      field: 'nickName',
      title: '昵称',
      width: 140,
    },
    {
      field: 'deptName',
      title: '部门',
      width: 120,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total'],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        // 部门树选择处理
        if (selectDeptId.value.length === 1) {
          formValues.deptId = selectDeptId.value[0];
        } else {
          Reflect.deleteProperty(formValues, 'deptId');
        }

        // 加载完毕需要设置选中的行
        if (props.mode === 'multiple') {
          const records = rightTableApi.grid.getData();
          await tableApi.grid.setCheckboxRow(records, true);
        }
        if (props.mode === 'single') {
          const records = rightTableApi.grid.getData();
          if (records.length === 1) {
            await tableApi.grid.setRadioRow(records[0]);
          }
        }

        return await userList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
  toolbarConfig: {
    // 自定义列
    custom: false,
    // 最大化
    zoom: false,
    // 刷新
    refresh: false,
  },
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    // 需要控制不同的事件 radio也会触发checkbox事件
    checkboxChange: checkBoxEvent,
    checkboxAll: checkBoxEvent,
    radioChange: radioEvent,
  },
});

function checkBoxEvent() {
  if (props.mode !== 'multiple') {
    return;
  }
  /**
   * 给右边表格赋值
   * records拿到的是当前页的选中数据
   * reserveRecords拿到的是其他页选中的数据
   */
  const records = tableApi.grid.getCheckboxRecords();
  const reserveRecords = tableApi.grid.getCheckboxReserveRecords();
  const realRecords = [...records, ...reserveRecords];
  rightTableApi.grid.loadData(realRecords);
}

function radioEvent() {
  if (props.mode !== 'single') {
    return;
  }
  // 给右边表格赋值
  const records = tableApi.grid.getRadioRecord();
  rightTableApi.grid.loadData([records]);
}

const rightGridOptions: VxeGridProps = {
  checkboxConfig: {},
  columns: [
    {
      field: 'nickName',
      title: '昵称',
      width: 200,
    },
    {
      field: 'action',
      title: '操作',
      width: 120,
      slots: { default: 'action' },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    enabled: false,
  },
  rowConfig: {
    isHover: true,
    keyField: 'userId',
  },
  toolbarConfig: {
    // 自定义列
    custom: false,
    // 最大化
    zoom: false,
    // 刷新
    refresh: false,
  },
};

const [RightBasicTable, rightTableApi] = useVbenVxeGrid({
  gridOptions: rightGridOptions,
});

async function handleRemoveItem(row: any) {
  if (props.mode === 'multiple') {
    await tableApi.grid.setCheckboxRow(row, false);
  }
  if (props.mode === 'single') {
    await tableApi.grid.clearRadioRow();
  }
  const data = rightTableApi.grid.getData();
  await rightTableApi.grid.loadData(data.filter((item) => item !== row));
  // 这个方法有问题
  // await rightTableApi.grid.remove(row);
}

function handleRemoveAll() {
  if (props.mode === 'multiple') {
    tableApi.grid.clearCheckboxRow();
    tableApi.grid.clearCheckboxReserve();
  }
  if (props.mode === 'single') {
    tableApi.grid.clearRadioRow();
  }
  rightTableApi.grid.loadData([]);
}

async function handleDeptQuery() {
  await tableApi.reload();
  // 重置后恢复 保存勾选的数据
  const records = rightTableApi.grid.getData();
  if (props.mode === 'multiple') {
    tableApi?.grid.setCheckboxRow(records, true);
  }
  if (props.mode === 'single' && records.length === 1) {
    tableApi.grid.setRadioRow(records[0]);
  }
}

function handleSubmit() {
  const records = rightTableApi.grid.getData();
  console.log(records);
  emit('finish', records);
  modalApi.close();
}
</script>

<template>
  <BasicModal>
    <div class="flex min-h-[600px]">
      <DeptTree
        v-model:select-dept-id="selectDeptId"
        :show-search="false"
        class="w-[230px]"
        @reload="() => tableApi.reload()"
        @select="handleDeptQuery"
      />
      <div class="h-[600px] w-[450px]">
        <BasicTable />
      </div>
      <div class="flex h-[600px] flex-col">
        <div class="flex w-full px-4">
          <div class="flex w-full items-center justify-between">
            <div>已选中人员</div>
            <div>
              <a-button size="small" @click="handleRemoveAll">
                清空选中
              </a-button>
            </div>
          </div>
        </div>
        <RightBasicTable>
          <template #action="{ row }">
            <a-button size="small" @click="handleRemoveItem(row)">
              移除
            </a-button>
          </template>
        </RightBasicTable>
      </div>
    </div>
  </BasicModal>
</template>

<style scoped>
:deep(div.vben-link) {
  display: none;
}

:deep(.vxe-body--row) {
  cursor: pointer;
}
</style>
