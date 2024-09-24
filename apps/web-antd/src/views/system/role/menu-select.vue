<script setup lang="ts">
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { CheckInfo } from 'ant-design-vue/es/vc-tree/props';

import type { Menu } from '#/api/system/menu/model';

import { computed, onMounted, type PropType, ref } from 'vue';

import { filter, listToTree } from '@vben/utils';

import { Checkbox, Tree } from 'ant-design-vue';

import { menuList } from '#/api/system/menu';

import { excludeIds } from '../tenantPackage/data';

defineOptions({ inheritAttrs: false });

const expandStatus = ref(false);
const selectAllStatus = ref(false);
const association = ref(true);

const associationText = computed(() => {
  return association.value ? '父子节点关联' : '父子节点独立';
});

const menuTree = ref<DataNode[]>([]);
// checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
const menuCheckStrictly = ref<boolean>(false);
// const checkedKeys = ref<string[]>([]);
const checkedKeys = defineModel('value', {
  default: () => [],
  type: Array as PropType<(number | string)[]>,
});
// 所有节点的ID
const responseAllKeys = ref<any[]>([]);

/** 已经选择的所有节点  包括子/父节点 */
// const checkedMenuKeys = ref<(number | string)[]>([]);

const checkedMenuKeys = defineModel('none', {
  default: () => [],
  type: Array as PropType<(number | string)[]>,
});
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

function handleExpandChange(e: CheckboxChangeEvent) {
  // 这个用于展示
  checkedKeys.value = e.target.checked ? responseAllKeys.value : [];
  // 这个用于提交
  checkedMenuKeys.value = e.target.checked ? responseAllKeys.value : [];
}

onMounted(async () => {
  const resp = await menuList();
  // 去除租户相关菜单(分配了也无权限)
  const afterTransform = transformMenu(resp);
  responseAllKeys.value = afterTransform.map((item) => item.menuId);
  console.log(responseAllKeys.value);
  const tree = listToTree(afterTransform, { id: 'menuId' });
  menuTree.value = tree;
});

function test() {
  console.log(checkedMenuKeys.value);
}
</script>

<template>
  <div class="bg-background w-full rounded-lg border-[1px] p-[12px]">
    <div class="flex items-center gap-2 border-b-[1px] pb-2">
      <span>节点状态: </span>
      <span
        :class="[association ? 'text-primary' : 'text-red-500']"
        class="font-semibold"
      >
        {{ associationText }}
      </span>
    </div>
    <div
      class="flex flex-wrap items-center justify-between border-b-[1px] py-2"
    >
      <Checkbox v-model:checked="expandStatus">展开/折叠全部</Checkbox>
      <Checkbox v-model:checked="selectAllStatus" @change="handleExpandChange">
        全选/取消全选
      </Checkbox>
      <Checkbox v-model:checked="association">父子节点关联</Checkbox>
    </div>
    <div class="py-2">
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
    </div>
    <a-button @click="test"> 测试 </a-button>
  </div>
</template>
