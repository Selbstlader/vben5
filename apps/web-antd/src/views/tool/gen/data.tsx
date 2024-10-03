import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Select',
    defaultValue: '',
    fieldName: 'dataName',
    label: '数据源',
  },
  {
    component: 'Input',
    fieldName: 'tableName',
    label: '表名称',
  },
  {
    component: 'Input',
    fieldName: 'tableComment',
    label: '表描述',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
];
