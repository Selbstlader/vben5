import type { FormSchemaGetter } from '#/adapter';

import { DictEnum } from '@vben/constants';

import { getDictOptions } from '#/utils/dict';

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
    component: 'Input',
    fieldName: 'noticeContent',
    formItemClass: 'col-span-2',
    label: '公告内容',
    rules: 'required',
  },
];
