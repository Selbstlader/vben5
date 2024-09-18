import { DictEnum } from '@vben/constants';

import { type FormSchemaGetter, z } from '#/adapter';
import { getDictOptions } from '#/utils/dict';

const accessPolicyOptions = [
  { color: 'orange', label: '私有', value: '0' },
  { color: 'green', label: '公开', value: '1' },
  { color: 'blue', label: '自定义', value: '2' },
];

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'ossConfigId',
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
    fieldName: 'configKey',
    label: '配置名称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'endpoint',
    label: '服务地址',
    renderComponentContent: (formModel) => ({
      addonBefore: () => (formModel.isHttps === 'Y' ? 'https://' : 'http://'),
    }),
    rules: z
      .string({ message: '请输入服务地址' })
      .refine(
        (domain) =>
          !(domain.startsWith('http://') || domain.startsWith('https://')),
        { message: '请输入正确的域名, 不需要http(s)' },
      ),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'domain',
    label: '自定义域名',
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
    fieldName: 'divider2',
    labelClass: 'w-0',
    renderComponentContent: () => ({
      default: () => '认证信息',
    }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'accessKey',
    label: 'accessKey',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'secretKey',
    label: 'secretKey',
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
      default: () => '其他信息',
    }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'bucketName',
    label: '桶名称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'prefix',
    label: '前缀',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: accessPolicyOptions,
      optionType: 'button',
    },
    defaultValue: '0',
    fieldName: 'accessPolicy',
    formItemClass: 'col-span-3 lg:col-span-2',
    label: '权限桶类型',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getDictOptions(DictEnum.SYS_YES_NO),
      optionType: 'button',
    },
    defaultValue: 'N',
    fieldName: 'isHttps',
    formItemClass: 'col-span-3 lg:col-span-1',
    label: '是否https',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'region',
    label: '区域',
  },
  {
    component: 'Textarea',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'remark',
    label: '备注',
  },
];
