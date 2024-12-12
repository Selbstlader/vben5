<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { getVxePopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { vxeCheckboxChecked } from '#/adapter/vxe-table';
import {
  workflowDefinitionActive,
  workflowDefinitionDelete,
  workflowDefinitionList,
} from '#/api/workflow/definition';

import CategoryTree from './category-tree.vue';
import { ActivityStatusEnum } from './constant';
import { columns, querySchema } from './data';

// 左边部门用
const selectedCode = ref<string[]>([]);

const formOptions: VbenFormProps = {
  schema: querySchema(),
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  handleReset: async () => {
    selectedCode.value = [];
    // eslint-disable-next-line no-use-before-define
    const { formApi, reload } = tableApi;
    await formApi.resetForm();
    const formValues = formApi.form.values;
    formApi.setLatestSubmissionValues(formValues);
    await reload(formValues);
  },
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'default',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        // 部门树选择处理
        if (selectedCode.value.length === 1) {
          formValues.categoryCode = selectedCode.value[0];
        } else {
          Reflect.deleteProperty(formValues, 'categoryCode');
        }

        return await workflowDefinitionList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'id',
    height: 66,
  },
  id: 'workflow-definition-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

async function handleDelete(row: Recordable<any>) {
  await workflowDefinitionDelete(row.id);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.id);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await workflowDefinitionDelete(ids);
      await tableApi.query();
    },
  });
}

const router = useRouter();
function handleDesign(row: any) {
  console.log(row);
  router.push({
    path: '/workflow/designer',
    query: { definitionId: row.id, disabled: 'true' },
  });
}

/**
 * 激活/挂起流程
 * @param row row
 */
async function handleActive(row: any) {
  await workflowDefinitionActive(row.id, row.activityStatus);
  await tableApi.query();
}
</script>

<template>
  <Page :auto-content-height="true">
    <div class="flex h-full gap-[8px]">
      <CategoryTree
        v-model:select-code="selectedCode"
        class="w-[260px]"
        @reload="() => tableApi.reload()"
        @select="() => tableApi.reload()"
      />
      <BasicTable class="flex-1 overflow-hidden" table-title="流程定义列表">
        <template #toolbar-tools>
          <Space>
            <a-button
              :disabled="!vxeCheckboxChecked(tableApi)"
              danger
              type="primary"
              v-access:code="['system:user:remove']"
              @click="handleMultiDelete"
            >
              {{ $t('pages.common.delete') }}
            </a-button>
            <a-button type="primary" v-access:code="['system:user:add']">
              {{ $t('pages.common.add') }}
            </a-button>
          </Space>
        </template>
        <template #action="{ row }">
          <div class="flex flex-col items-baseline gap-1">
            <div>
              <a-button
                v-if="row.activityStatus === ActivityStatusEnum.Active"
                size="small"
                type="link"
                @click="() => handleActive(row)"
              >
                挂起流程
              </a-button>
              <a-button
                v-if="row.activityStatus === ActivityStatusEnum.Suspended"
                size="small"
                type="link"
                @click="() => handleActive(row)"
              >
                激活流程
              </a-button>
              <a-button size="small" type="link"> 历史版本 </a-button>
              <Popconfirm
                :get-popup-container="getVxePopupContainer"
                placement="left"
                title="确认删除？"
                @confirm="handleDelete(row)"
              >
                <a-button danger size="small" type="link" @click.stop="">
                  删除流程
                </a-button>
              </Popconfirm>
            </div>
            <div>
              <a-button size="small" type="link"> 绑定业务 </a-button>
              <a-button size="small" type="link" @click="handleDesign(row)">
                查看流程
              </a-button>
              <a-button size="small" type="link"> 发布流程 </a-button>
              <a-button size="small" type="link"> 复制流程 </a-button>
            </div>
          </div>
        </template>
      </BasicTable>
    </div>
  </Page>
</template>
