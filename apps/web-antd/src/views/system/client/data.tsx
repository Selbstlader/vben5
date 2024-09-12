import type { FormSchemaGetter } from '#/adapter';

import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { getDictOptions } from '#/utils/dict';

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
    componentProps: {
      disabled: true,
      placeholder: '请输入',
    },
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'clientId',
    label: '客户端ID',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'clientKey',
    label: '客户端key',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'clientSecret',
    label: '客户端密钥',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      class: 'w-full',
      getPopupContainer,
      mode: 'multiple',
      optionFilterProp: 'label',
      options: getDictOptions(DictEnum.SYS_GRANT_TYPE),
      placeholder: '请选择',
    },
    fieldName: 'grantTypeList',
    label: '授权类型',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: false,
      class: 'w-full',
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_DEVICE_TYPE),
      placeholder: '请选择',
    },
    fieldName: 'deviceType',
    label: '设备类型',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      addonAfter: '秒',
      placeholder: '请输入',
    },
    defaultValue: 1800,
    fieldName: 'activeTimeout',
    formItemClass: 'col-span-2 lg:col-span-1',
    help: '指定时间无操作则过期(单位：秒), 默认30分钟(1800秒)',
    label: 'Token活跃超时时间',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      addonAfter: '秒',
      placeholder: '请输入',
    },
    defaultValue: 604_800,
    fieldName: 'timeout',
    formItemClass: 'col-span-2 lg:col-span-1 ',
    help: '指定时间必定过期(单位：秒)，默认七天(604800秒)',
    label: 'Token固定超时时间',
    rules: 'required',
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
    label: '状态',
  },
];
