<script setup lang="tsx">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { Recordable } from '@vben/types';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { menuList, menuRemove } from '#/api/system/menu';
import { useAccess } from '@vben/access';
import { Fallback, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { eachTree, getVxePopupContainer, listToTree } from '@vben/utils';
import { Checkbox, Popconfirm, Space } from 'ant-design-vue';
import { computed } from 'vue';

/**
 * 不要问为什么有两个根节点 v-if会控制只会渲染一个
 */
type Permission = {
  checked: boolean;
  menuId: string;
  name: string;
};

const gridOptions: VxeGridProps = {
  columns: [
    {
      title: '菜单名称',
      field: 'menuName',
      treeNode: true,
      width: 200,
      slots: {
        // 需要i18n支持 否则返回原始值
        default: ({ row }) => {
          function onChange(e: CheckboxChangeEvent) {
            console.log(e);
            const { checked } = e.target;
            if (checked) {
              row?.permissions?.forEach?.((item: Permission) => {
                item.checked = true;
              });
            } else {
              row?.permissions?.forEach?.((item: Permission) => {
                item.checked = false;
              });
            }
          }

          return (
            <div>
              <Checkbox onChange={onChange} v-model:checked={row.checked}>
                {row.menuName}
              </Checkbox>
            </div>
          );
        },
      },
    },
    {
      title: '权限标识',
      field: 'permissions',
      slots: {
        default: ({ row }) => {
          const permissions: Permission[] = row.permissions;
          function onChange() {
            const allChecked = (row.permissions as any[]).every(
              (item) => item.checked,
            );
            if (allChecked) {
              row.checked = true;
            }

            const allUnChecked = (row.permissions as any[]).every(
              (item) => !item.checked,
            );
            if (allUnChecked) {
              row.checked = false;
            }
          }

          return (
            <div>
              {permissions?.map((item) => (
                <Checkbox onChange={onChange} v-model:checked={item.checked}>
                  {item.name}
                </Checkbox>
              ))}
            </div>
          );
        },
      },
    },
  ],
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
        const treeData = listToTree(resp, { id: 'menuId' });

        eachTree(treeData, (node) => {
          if (node.menuType === 'C' && node.children?.length > 0) {
            node.permissions = (node.children as any[]).map((item) => ({
              name: item?.menuName,
              menuId: item.menuId,
              checked: true,
            }));
            Reflect.deleteProperty(node, 'children');
          }
          node.checked = true;
        });

        return { rows: treeData };
      },
    },
  },
  toolbarConfig: {
    // 自定义列
    custom: false,
    // 最大化
    zoom: false,
    // 刷新
    refresh: false,
  },
  rowConfig: {
    isHover: true,
    keyField: 'menuId',
  },
  /**
   * 开启虚拟滚动
   * 数据量小可以选择关闭
   * 如果遇到样式问题(空白、错位 滚动等)可以选择关闭虚拟滚动
   */
  scrollY: {
    enabled: true,
    gt: 0,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'menuId',
    transform: false,
  },
  id: 'system-menu-index',
  showOverflow: true,
};

const [BasicTable, tableApi] = useVbenVxeGrid({
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
    <BasicTable table-title="菜单列表" table-title-help="双击展开/收起子菜单">
      <template #toolbar-tools>
        <Space>
          <a-button @click="setExpandOrCollapse(false)">
            {{ $t('pages.common.collapse') }}
          </a-button>
          <a-button @click="setExpandOrCollapse(true)">
            {{ $t('pages.common.expand') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <Popconfirm
            :get-popup-container="getVxePopupContainer"
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
  </Page>
  <Fallback v-else description="您没有菜单管理的访问权限" status="403" />
</template>
