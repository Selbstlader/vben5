import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'ipaddr',
    label: 'IP地址',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'userName',
    label: '用户账号',
  },
];
