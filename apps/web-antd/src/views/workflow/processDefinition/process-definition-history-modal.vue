<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid, type VxeGridProps } from '@vben/plugins/vxe-table';
import { getVxePopupContainer } from '@vben/utils';

import { Popconfirm } from 'ant-design-vue';

import {
  getHisListByKey,
  workflowDefinitionActive,
  workflowDefinitionCopy,
  workflowDefinitionDelete,
  workflowDefinitionPublish,
} from '#/api/workflow/definition';

import { ActivityStatusEnum } from './constant';
import { columns } from './data';

const [BasicModal, modalApi] = useVbenModal({
  title: '历史版本',
  class: 'w-[1000px]',
  footer: false,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    const { flowCode, currentId } = modalApi.getData() as {
      currentId: string;
      flowCode: string;
    };
    const resp = await getHisListByKey(flowCode);
    const omitCurrentList = resp.filter((item) => item.id !== currentId);
    // eslint-disable-next-line no-use-before-define
    await tableApi.grid.loadData(omitCurrentList);
  },
});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    trigger: 'default',
  },
  columns: columns?.filter((item) => item.type !== 'checkbox'),
  height: 600,
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    isHover: true,
    keyField: 'id',
    height: 100,
  },
  toolbarConfig: {
    custom: false,
    zoom: false,
    refresh: false,
  },
  id: 'workflow-definition-history',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

/**
 * 发布流程
 * @param row row
 */
async function handlePublish(row: any) {
  await workflowDefinitionPublish(row.id);
  await tableApi.query();
}

const router = useRouter();
/**
 * 流程设计/预览
 * @param row row
 * @param disabled true为预览，false为设计
 */
function handleDesign(row: any, disabled: boolean) {
  router.push({
    path: '/workflow/designer',
    query: { definitionId: row.id, disabled: String(disabled) },
  });
}

async function handleDelete(row: Recordable<any>) {
  await workflowDefinitionDelete(row.id);
  await tableApi.query();
}

/**
 * 复制流程
 * @param row row
 */
async function handleCopy(row: any) {
  await workflowDefinitionCopy(row.id);
  await tableApi.query();
}

/**
 * 激活/挂起流程
 * @param row row
 */
async function handleActive(row: any) {
  await workflowDefinitionActive(row.id, !row.activityStatus);
  await tableApi.query();
}
</script>

<template>
  <BasicModal>
    <!-- TODO: 添加操作列 -->
    <BasicTable>
      <template #action="{ row }">
        <div class="flex flex-col gap-1">
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
            <a-button
              size="small"
              type="link"
              @click="handleDesign(row, !!row.isPublish)"
            >
              {{ row.isPublish ? '查看流程' : '设计流程' }}
            </a-button>
            <Popconfirm
              :get-popup-container="getVxePopupContainer"
              :title="`确认发布流程[${row.flowName}]?`"
              placement="left"
              @confirm="handlePublish(row)"
            >
              <a-button v-if="!row.isPublish" size="small" type="link">
                发布流程
              </a-button>
            </Popconfirm>
            <Popconfirm
              :get-popup-container="getVxePopupContainer"
              :title="`确认复制流程[${row.flowName}]?`"
              placement="left"
              @confirm="handleCopy(row)"
            >
              <a-button size="small" type="link"> 复制流程 </a-button>
            </Popconfirm>
          </div>
        </div>
      </template>
    </BasicTable>
  </BasicModal>
</template>
