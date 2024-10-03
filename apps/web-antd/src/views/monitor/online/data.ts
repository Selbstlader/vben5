import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'ipaddr',
    label: 'IP地址',
  },
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户账号',
  },
];
