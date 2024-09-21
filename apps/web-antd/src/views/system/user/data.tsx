import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter, z } from '#/adapter';
import { getDictOptions } from '#/utils/dict';

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'userId',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'userName',
    label: '用户账号',
    rules: 'required',
  },
  {
    component: 'InputPassword',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'password',
    label: '用户密码',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'nickName',
    label: '用户昵称',
    rules: 'required',
  },
  {
    component: 'TreeSelect',
    componentProps: {
      class: 'w-full',
      getPopupContainer,
      placeholder: '请选择',
    },
    fieldName: 'deptId',
    label: '所属部门',
    rules: 'selectRequired',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'phone',
    label: '手机号码',
    rules: z
      .string()
      .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码')
      .optional(),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'email',
    label: '邮箱',
    rules: z.string().email('请输入正确的邮箱').optional(),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_USER_SEX),
      optionType: 'button',
    },
    defaultValue: '0',
    fieldName: 'sex',
    formItemClass: 'col-span-2 lg:col-span-1',
    label: '性别',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_COMMON_STATUS),
      optionType: 'button',
    },
    defaultValue: '0',
    fieldName: 'status',
    formItemClass: 'col-span-2 lg:col-span-1',
    label: '状态',
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      getPopupContainer,
      placeholder: '请选择',
    },
    fieldName: 'postIds',
    label: '岗位',
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      getPopupContainer,
      placeholder: '请选择',
    },
    fieldName: 'roleIds',
    label: '角色',
  },
  {
    component: 'Textarea',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'remark',
    formItemClass: 'items-baseline',
    label: '备注',
  },
];
