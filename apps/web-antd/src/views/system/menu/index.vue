<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { computed } from 'vue';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { Fallback } from '@vben/common-ui';
import {
  eachTree,
  getPopupContainer,
  listToTree,
  removeEmptyChildren,
} from '@vben/utils';

import { Popconfirm, Space, Tooltip } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter';
import { menuList, menuRemove } from '#/api/system/menu';

import { columns, querySchema } from './data';
import menuDrawer from './menu-drawer.vue';

/**
 * 不要问为什么有两个根节点 v-if会控制只会渲染一个
 */
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues = {}) => {
        const resp = await menuList({
          ...formValues,
        });
        const treeData = listToTree(resp, {
          id: 'menuId',
          pid: 'parentId',
          children: 'children',
        });
        removeEmptyChildren(treeData);
        return { rows: treeData };
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: 'menuId',
  },

  treeConfig: {
    parentField: 'parentId',
    rowField: 'menuId',
    transform: false,
  },
  id: 'system-menu-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    cellDblclick: (e: any) => {
      const { row = {} } = e;
      if (!row?.children) {
        return;
      }
      const isExpanded = row?.expand;
      tableApi.grid.setTreeExpand(row, !isExpanded);
      row.expand = !isExpanded;
    },
    // 需要监听使用箭头展开的情况 否则展开/折叠的数据不一致
    toggleTreeExpand: (e: any) => {
      const { row = {}, expanded } = e;
      row.expand = expanded;
    },
  },
});
const [MenuDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: menuDrawer,
});

function handleAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

function handleSubAdd(row: Recordable<any>) {
  const { menuId } = row;
  drawerApi.setData({ id: menuId, update: false });
  drawerApi.open();
}

async function handleEdit(record: Recordable<any>) {
  drawerApi.setData({ id: record.menuId, update: true });
  drawerApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await menuRemove(row.menuId);
  await tableApi.query();
}

/**
 * 全部展开/折叠
 * @param expand 是否展开
 */
function setExpandOrCollapse(expand: boolean) {
  eachTree(tableApi.grid.getData(), (item) => (item.expand = expand));
  tableApi.grid?.setAllTreeExpand(expand);
}

/**
 * 与后台逻辑相同
 * 只有租户管理和超级管理能访问菜单管理
 */
const { hasAccessByRoles } = useAccess();
const isAdmin = computed(() => {
  return hasAccessByRoles(['admin', 'superadmin']);
});
</script>

<template>
  <Page v-if="isAdmin" :auto-content-height="true">
    <BasicTable>
      <template #toolbar-actions>
        <div class="flex items-center gap-[6px]">
          <span class="pl-[7px] text-[16px]">菜单列表</span>
          <Tooltip title="提示：双击展开/收起子菜单">
            <QuestionCircleOutlined class="text-center" />
          </Tooltip>
        </div>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button @click="setExpandOrCollapse(false)">
            {{ $t('pages.common.collapse') }}
          </a-button>
          <a-button @click="setExpandOrCollapse(true)">
            {{ $t('pages.common.expand') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['system:menu:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button
            v-access:code="['system:menu:edit']"
            @click="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </ghost-button>
          <!-- '按钮类型'无法再添加子菜单 -->
          <ghost-button
            v-if="row.menuType !== 'F'"
            class="btn-add"
            v-access:code="['system:menu:add']"
            @click="handleSubAdd(row)"
          >
            {{ $t('pages.common.add') }}
          </ghost-button>
          <Popconfirm
            :get-popup-container="getPopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <ghost-button
              danger
              v-access:code="['system:menu:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <MenuDrawer @reload="tableApi.query()" />
  </Page>
  <Fallback v-else description="您没有菜单管理的访问权限" status="403" />
</template>

<style lang="scss" scoped>
.btn-add {
  color: hsl(var(--success)) !important;
  border-color: hsl(var(--success)) !important;

  &:hover {
    color: hsl(var(--success) / 50%) !important;
    border-color: hsl(var(--success) / 50%) !important;
  }
}
</style>
