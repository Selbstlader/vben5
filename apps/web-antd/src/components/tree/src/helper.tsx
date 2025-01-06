import type { MenuPermissionOption } from './data';

import type { MenuOption } from '#/api/system/menu/model';

import { eachTree } from '@vben/utils';

import { difference } from 'lodash-es';

/**
 * 权限列设置是否全选
 * @param record 行记录
 * @param checked 是否选中
 */
export function setPermissionsChecked(
  record: MenuPermissionOption,
  checked: boolean,
) {
  if (record?.permissions?.length > 0) {
    // 全部设置为选中
    record.permissions.forEach((permission) => {
      permission.checked = checked;
    });
  }
}

/**
 * 设置当前行 & 所有子节点选中状态
 * @param record 行
 * @param checked 是否选中
 */
export function rowAndChildrenChecked(
  record: MenuPermissionOption,
  checked: boolean,
) {
  // 当前行选中
  setPermissionsChecked(record, checked);
  // 所有子节点选中
  record?.children?.forEach?.((permission) => {
    rowAndChildrenChecked(permission as MenuPermissionOption, checked);
  });
}

/**
 * void方法 会直接修改原始数据
 * 将树结构转为 tree+permissions结构
 * @param menus 后台返回的menu
 */
export function menusWithPermissions(menus: MenuOption[]) {
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
