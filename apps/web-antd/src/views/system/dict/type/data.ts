import { type FormSchemaGetter, z } from '#/adapter';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'dictName',
    label: '字典名称',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'dictType',
    label: '字典类型',
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'dictId',
    label: 'dictId',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'dictName',
    label: '字典名称',
    rules: 'required',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'dictType',
    help: '使用英文/下划线命名, 如:sys_normal_disable',
    label: '字典类型',
    rules: z
      .string()
      .regex(/^[a-z_]+$/i, { message: '字典类型只能使用英文/下划线命名' }),
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
