import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'fileName',
    label: '文件名',
  },
  {
    component: 'Input',
    fieldName: 'originalName',
    label: '原名',
  },
  {
    component: 'Input',
    fieldName: 'fileSuffix',
    label: '拓展名',
  },
  {
    component: 'Input',
    fieldName: 'service',
    label: '服务商',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
];
