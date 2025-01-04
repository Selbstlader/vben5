<script setup lang="tsx">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MenuOption } from '#/api/system/menu/model';

import type { MenuPermissionOption, Permission } from './data';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { cloneDeep, eachTree, findGroupParentIds } from '@vben/utils';
import { Alert, Checkbox, RadioGroup, Space } from 'ant-design-vue';
import { difference, uniq } from 'lodash-es';
import { nextTick, onMounted, ref, watch } from 'vue';

import { columns } from './data';

defineOptions({
  name: 'MenuSelectTable',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    checkedKeys: (number | string)[];
    defaultExpandAll?: boolean;
    menus: MenuOption[];
  }>(),
  {
    /**
     * 是否默认展开全部
     */
    defaultExpandAll: true,
    /**
     * 注意这里不是双向绑定 需要调用getCheckedKeys实例方法来获取真正选中的节点
     */
    checkedKeys: () => [],
  },
);

/**
 * 是否节点关联
 */
const association = defineModel('association', {
  type: Boolean,
  default: true,
});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // checkbox显示的字段
    labelField: 'label',
    // 是否严格模式 即节点不关联
    checkStrictly: !association.value,
  },
  size: 'small',
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    enabled: false,
  },
  toolbarConfig: {
    // 自定义列
    custom: false,
    // 最大化
    zoom: true,
    // 刷新
    refresh: false,
  },
  rowConfig: {
    isHover: false,
    isCurrent: false,
    keyField: 'id',
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
    rowField: 'id',
    transform: false,
  },
  showOverflow: false,
};

/**
 * 设置是否全选
 * @param record 行记录
 * @param checked 是否选中
 */
function setPermissionsChecked(record: MenuPermissionOption, checked: boolean) {
  if (record?.permissions?.length > 0) {
    // 全部设置为选中
    record.permissions.forEach((permission: Permission) => {
      permission.checked = checked;
    });
  }
}

// 所有子节点
function allChecked(record: MenuPermissionOption, checked: boolean) {
  setPermissionsChecked(record, checked);
  record.children?.forEach((permission) => {
    allChecked(permission as MenuPermissionOption, checked);
  });
}

/**
 * 用于界面显示选中的数量
 */
const checkedLength = ref(0);
/**
 * 更新选中的数量
 */
function updateCheckedLength() {
  checkedLength.value = getCheckedKeys().length;
}

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
  gridEvents: {
    checkboxChange: (params) => {
      // 节点独立 不做处理
      if (!association.value) {
        updateCheckedLength();
        return;
      }
      // 选中还是取消选中
      const checked = params.checked;
      // 行
      const record = params.row;
      // 设置所有子节点选中状态
      allChecked(record, checked);
      updateCheckedLength();
    },
    checkboxAll: (params) => {
      const records = params.$grid.getData();
      records.forEach((item) => {
        allChecked(item, params.checked);
      });
      updateCheckedLength();
    },
  },
});

/**
 * void方法 会直接修改原始数据
 * 将树结构转为 tree+permissions结构
 * @param menus 后台返回的menu
 */
function menusWithPermissions(menus: MenuOption[]) {
  eachTree(menus, (item: MenuPermissionOption) => {
    if (item.children && item.children.length > 0) {
      /**
       * 所有为按钮的节点提取出来
       * 需要注意 这里需要过滤目录下直接是按钮的情况item.menuType !== 'M'
       * 将按钮往children添加而非加到permissions
       */
      const permissions = item.children.filter(
        (child: MenuOption) => child.menuType === 'F' && item.menuType !== 'M',
      );
      // 取差集
      const diffCollection = difference(item.children, permissions);
      // 更新后的children  即去除按钮
      item.children = diffCollection;

      // permissions作为字段添加到item
      const permissionsArr = permissions.map((permission) => {
        return {
          id: permission.id,
          label: permission.label,
          checked: false,
        };
      });
      item.permissions = permissionsArr;
    }
  });
}

/**
 * 设置表格选中
 * @param menus menu
 * @param keys 选中的key
 * @param handleChildren 节点独立情况 不需要处理children
 */
function setCheckedByKeys(
  menus: MenuPermissionOption[],
  keys: (number | string)[],
  handleChildren: boolean,
) {
  menus.forEach((item) => {
    // 设置行选中
    if (keys.includes(item.id)) {
      tableApi.grid.setCheckboxRow(item, true);
    }
    // 设置权限columns选中
    if (item.permissions && item.permissions.length > 0) {
      item.permissions.forEach((permission) => {
        if (keys.includes(permission.id)) {
          permission.checked = true;
          // 手动触发onChange来选中 节点独立情况不需要处理
          handleChildren && handlePermissionChange(item);
        }
      });
    }
    // 设置children选中
    if (item.children && item.children.length > 0) {
      setCheckedByKeys(item.children as any, keys, handleChildren);
    }
  });
}

onMounted(() => {
  /**
   * 加载表格数据
   */
  watch(
    () => props.menus,
    async (menus) => {
      const clonedMenus = cloneDeep(menus);
      menusWithPermissions(clonedMenus);
      console.log(clonedMenus);
      await tableApi.grid.loadData(clonedMenus);
      await nextTick();
      if (props.defaultExpandAll) {
        setExpandOrCollapse(true);
      }
    },
  );

  /**
   * 节点关联设置表格勾选效果
   */
  watch(association, (value) => {
    tableApi.setGridOptions({
      checkboxConfig: {
        checkStrictly: !value,
      },
    });
  });

  /**
   * checkedKeys依赖menus 要在外部确保menus先加载
   */
  watch(
    () => props.checkedKeys,
    (value) => {
      const allCheckedKeys = uniq([...value]);
      // 赋值
      const records = tableApi.grid.getData();
      setCheckedByKeys(records, allCheckedKeys, association.value);
    },
  );
});

const options = [
  { label: '节点关联', value: true },
  { label: '节点独立', value: false },
];

async function handleAssociationChange() {
  // 清空全部permissions选中
  const records = tableApi.grid.getData();
  records.forEach((item) => {
    allChecked(item, false);
  });
  // 需要清空全部勾选
  await tableApi.grid.clearCheckboxRow();
  updateCheckedLength();
}

/**
 * 全部展开/折叠
 * @param expand 是否展开
 */
function setExpandOrCollapse(expand: boolean) {
  tableApi.grid?.setAllTreeExpand(expand);
}

function handlePermissionChange(row: any) {
  // 节点关联
  if (association.value) {
    const checkedPermissions = row.permissions.filter(
      (item: any) => item.checked === true,
    );
    // 有一条选中 则整个行选中
    if (checkedPermissions.length > 0) {
      tableApi.grid.setCheckboxRow(row, true);
    }
    // 无任何选中 则整个行不选中
    if (checkedPermissions.length === 0) {
      tableApi.grid.setCheckboxRow(row, false);
    }
  }
  // 节点独立 不处理
  updateCheckedLength();
}

/**
 * 获取勾选的key
 * @param records 行记录
 */
function getKeys(records: MenuPermissionOption[], handleChildren: boolean) {
  const allKeys: (number | string)[] = [];
  records.forEach((item) => {
    if (item.children && item.children.length > 0) {
      const keys = getKeys(
        item.children as MenuPermissionOption[],
        handleChildren,
      );
      allKeys.push(...keys);
    } else {
      // 当前id
      handleChildren && allKeys.push(item.id);
      // 权限id
      if (item.permissions && item.permissions.length > 0) {
        const ids = item.permissions
          .filter((m) => m.checked === true)
          .map((m) => m.id);
        allKeys.push(...ids);
      }
    }
  });
  return uniq(allKeys);
}

/**
 * 获取选中的key
 */
function getCheckedKeys() {
  // 节点关联
  if (association.value) {
    const records = tableApi?.grid?.getCheckboxRecords?.() ?? [];
    // 子节点
    const nodeKeys = getKeys(records, true);
    // 父节点
    const parentIds = findGroupParentIds(props.menus, nodeKeys as number[]);
    const realKeys = uniq([...parentIds, ...nodeKeys]);
    return realKeys;
  }
  // 节点独立

  // 勾选的行
  const records = tableApi?.grid?.getCheckboxRecords?.() ?? [];
  // 全部数据 用于获取permissions
  const allRecords = tableApi?.grid?.getData?.() ?? [];
  const ids = records.map((item) => item.id);
  const permissions = getKeys(allRecords, false);
  const allIds = uniq([...ids, ...permissions]);
  return allIds;
}

defineExpose({
  getCheckedKeys,
});
</script>

<template>
  <div class="flex h-full flex-col">
    <Alert class="mx-2 mb-2" message="beta功能" type="warning" show-icon />
    <BasicTable>
      <template #toolbar-actions>
        <RadioGroup
          v-model:value="association"
          :options="options"
          button-style="solid"
          option-type="button"
          @change="handleAssociationChange"
        />
        <Alert class="mx-2" type="info" show-icon>
          <template #message>
            <div v-if="tableApi?.grid">
              已选中
              <span class="text-primary mx-1 font-semibold">
                {{ checkedLength }}
              </span>
              个节点
            </div>
          </template>
        </Alert>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button @click="getCheckedKeys">打印选中的节点</a-button>
          <a-button @click="setExpandOrCollapse(false)">
            {{ $t('pages.common.collapse') }}
          </a-button>
          <a-button @click="setExpandOrCollapse(true)">
            {{ $t('pages.common.expand') }}
          </a-button>
        </Space>
      </template>
      <template #permissions="{ row }">
        <div class="flex flex-wrap gap-3">
          <Checkbox
            v-for="permission in row.permissions"
            :key="permission.id"
            v-model:checked="permission.checked"
            @change="() => handlePermissionChange(row)"
          >
            {{ permission.label }}
          </Checkbox>
        </div>
      </template>
    </BasicTable>
  </div>
</template>

<style scoped>
:deep(.ant-alert) {
  padding: 4px 8px;
}
</style>
