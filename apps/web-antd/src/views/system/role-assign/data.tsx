import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'userName',
    label: '用户账号',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'phonenumber',
    label: '手机号码',
  },
];
