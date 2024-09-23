<script setup lang="ts">
import type { DataNode } from 'ant-design-vue/es/tree';
import type { CheckInfo } from 'ant-design-vue/es/vc-tree/props';

import type { Menu } from '#/api/system/menu/model';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { filter, listToTree } from '@vben/utils';

import { Card, Tree } from 'ant-design-vue';

import { menuList } from '#/api/system/menu';

import { excludeIds } from './data';
import tenantPackageDrawer from './tenant-package-drawer.vue';

const [TenantPackageDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: tenantPackageDrawer,
});

function handleAdd() {
  drawerApi.setData({ update: false });
  drawerApi.open();
}

const menuTree = ref<DataNode[]>([]);
// checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
const menuCheckStrictly = ref<boolean>(false);
const checkedKeys = ref<string[]>([]);

/** 已经选择的所有节点  包括子/父节点 */
const checkedMenuKeys = ref<(number | string)[]>([]);
/**
 *
 * @param checkedKeys 已经选中的子节点的ID
 * @param info info.halfCheckedKeys为父节点的ID
 */
type CheckedState<T = number | string> =
  | { checked: T[]; halfChecked: T[] }
  | T[];
function handleChecked(checkedKeys: CheckedState, info: CheckInfo) {
  // 数组的话为节点关联
  if (Array.isArray(checkedKeys)) {
    const halfCheckedKeys: number[] = (info.halfCheckedKeys || []) as number[];
    checkedMenuKeys.value = [...halfCheckedKeys, ...checkedKeys];
  } else {
    checkedMenuKeys.value = [...checkedKeys.checked];
  }
}

/**
 * 不显示租户相关菜单  分配了也没法使用
 * @param menuTree menus
 */
function transformMenu(menuTree: Menu[]) {
  return filter(
    menuTree,
    (item) => {
      if (excludeIds.includes(item.menuId)) {
        return false;
      }
      return true;
    },
    { id: 'menuId', pid: 'parentId', children: 'children' },
  );
}

onMounted(async () => {
  const resp = await menuList();
  // 去除租户相关菜单(分配了也无权限)
  const afterTransform = transformMenu(resp);
  const tree = listToTree(afterTransform, { id: 'menuId' });
  menuTree.value = tree;
});

function test() {
  console.log(checkedMenuKeys.value);
}
</script>

<template>
  <Page>
    <a-button type="primary" @click="handleAdd">
      {{ $t('pages.common.add') }}
    </a-button>
    <a-button @click="test">获取</a-button>
    <Card>
      <Tree
        v-if="menuTree.length > 0"
        v-model:check-strictly="menuCheckStrictly"
        v-model:checked-keys="checkedKeys"
        :checkable="true"
        :field-names="{ title: 'menuName', key: 'menuId' }"
        :selectable="false"
        :tree-data="menuTree"
        @check="handleChecked"
      />
    </Card>
    <TenantPackageDrawer />
  </Page>
</template>
