import type { FormSchemaGetter } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Select',
    componentProps: {
      allowClear: false,
      placeholder: '请选择',
    },
    defaultValue: '',
    fieldName: 'dataName',
    label: '数据源',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'tableName',
    label: '表名称',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'tableComment',
    label: '表描述',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
];
