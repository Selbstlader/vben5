import type { FormSchemaGetter } from '#/adapter';

import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { getDictOptions } from '#/utils/dict';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'noticeTitle',
    label: '公告标题',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'createBy',
    label: '创建人',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NOTICE_TYPE),
      placeholder: '请选择',
    },
    fieldName: 'noticeType',
    label: '公告类型',
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'noticeId',
    label: '主键',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'noticeTitle',
    formItemClass: 'col-span-2',
    label: '公告标题',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      class: 'grid-cols-2',
      options: getDictOptions(DictEnum.SYS_NOTICE_STATUS),
      optionType: 'button',
    },
    defaultValue: '0',
    fieldName: 'status',
    label: '公告状态',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      class: 'grid-cols-2',
      options: getDictOptions(DictEnum.SYS_NOTICE_TYPE),
      optionType: 'button',
    },
    defaultValue: '1',
    fieldName: 'noticeType',
    label: '公告类型',
    rules: 'required',
  },
  {
    component: 'RichTextarea',
    componentProps: {
      width: '100%',
    },
    fieldName: 'noticeContent',
    formItemClass: 'col-span-2',
    label: '公告内容',
    rules: 'required',
  },
];
