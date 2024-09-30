import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { type FormSchemaGetter, z } from '#/adapter';
import { getDictOptions } from '#/utils/dict';

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
    fieldName: 'nickName',
    label: '用户昵称',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'phonenumber',
    label: '手机号码',
    rules: z
      .string()
      .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码')
      .optional(),
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
      placeholder: '请选择',
    },
    fieldName: 'status',
    label: '用户状态',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
];
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
    // 在drawer里更新 这里不需要默认的componentProps
    defaultValue: undefined,
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
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
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
      getPopupContainer,
      mode: 'multiple',
      optionFilterProp: 'label',
      optionLabelProp: 'label',
      placeholder: '请先选择部门',
    },
    fieldName: 'postIds',
    help: '选择部门后, 将自动加载该部门下所有的岗位',
    label: '岗位',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      mode: 'multiple',
      optionFilterProp: 'label',
      optionLabelProp: 'label',
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
