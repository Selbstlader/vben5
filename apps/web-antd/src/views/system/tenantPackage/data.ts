import type { FormSchemaGetter } from '#/adapter';

export const schema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'packageName',
    label: '套餐名称',
  },
];

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'packageId',
  },
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'menuCheckStrictly',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'packageName',
    label: '套餐名称',
    rules: 'required',
  },
  {
    component: 'menuIds',
    defaultValue: [],
    fieldName: 'menuIds',
    label: '关联菜单',
  },
  {
    component: 'Textarea',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'remark',
    formItemClass: 'items-baseline',
  },
];

// 租户管理 不可分配  只有superadmin有权限操作 分配了也没用
export const excludeIds = [
  6, 121, 122, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615,
];
