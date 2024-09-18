import { getPopupContainer } from '@vben/utils';

import dayjs from 'dayjs';

import { type FormSchemaGetter, z } from '#/adapter';

const defaultExpireTime = dayjs()
  .add(365, 'days')
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss');

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'id',
    label: 'id',
  },
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'tenantId',
    label: 'tenantId',
  },
  {
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
    fieldName: 'divider1',
    labelClass: 'w-0',
    renderComponentContent: () => ({
      default: () => '基本信息',
    }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'companyName',
    label: '企业名称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'contactUserName',
    label: '联系人',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'contactPhone',
    label: '联系电话',
    rules: z
      .string()
      .regex(/^1[3-9]\d{9}$/, { message: '请输入正确的联系电话' }),
  },
  {
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
    fieldName: 'divider2',
    labelClass: 'w-0',
    renderComponentContent: () => ({
      default: () => '管理员信息',
    }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'username',
    label: '用户账号',
    rules: 'required',
  },
  {
    component: 'InputPassword',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'password',
    label: '密码',
    rules: 'required',
  },
  {
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
    fieldName: 'divider3',
    labelClass: 'w-0',
    renderComponentContent: () => ({
      default: () => '租户设置',
    }),
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      getPopupContainer,
      placeholder: '请选择',
    },
    fieldName: 'packageId',
    label: '租户套餐',
    rules: 'required',
  },
  {
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    defaultValue: defaultExpireTime,
    fieldName: 'expireTime',
    help: `已经设置过期时间不允许重置为'无期限'\n即在开通时未设置无期限 以后都不允许设置`,
    label: '过期时间',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: -1,
      placeholder: '请输入',
    },
    defaultValue: -1,
    fieldName: 'accountCount',
    help: '-1不限制用户数量',
    label: '用户数量',
    renderComponentContent(model) {
      return {
        addonBefore: () =>
          model.accountCount === -1 ? '不限制数量' : '输入数量',
      };
    },
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'domain',
    help: '可填写域名/端口 填写域名如: www.test.com 或者 www.test.com:8080 填写ip:端口如: 127.0.0.1:8080',
    label: '绑定域名',
    renderComponentContent() {
      return {
        addonBefore: () => 'http(s)://',
      };
    },
    rules: z
      .string()
      .refine(
        (domain) =>
          !(domain.startsWith('http://') || domain.startsWith('https://')),
        { message: '请输入正确的域名, 不需要http(s)' },
      )
      .optional(),
  },
  {
    component: 'Divider',
    componentProps: {
      orientation: 'center',
    },
    fieldName: 'divider4',
    labelClass: 'w-0',
    renderComponentContent: () => ({
      default: () => '企业信息',
    }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'address',
    label: '企业地址',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'licenseNumber',
    label: '企业代码',
  },
  {
    component: 'Textarea',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'intro',
    formItemClass: 'items-baseline',
    label: '企业介绍',
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
