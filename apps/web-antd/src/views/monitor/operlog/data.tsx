import type { ColumnType } from 'ant-design-vue/es/table';

import type { FormSchemaGetter } from '#/adapter';
import type { DescItem } from '#/components/description';

import { DictEnum } from '@vben/constants';

import { Tag } from 'ant-design-vue';

import { getDictOptions } from '#/utils/dict';
import {
  renderDict,
  renderHttpMethodTag,
  renderJsonPreview,
} from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'title',
    label: '系统模块',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'operName',
    label: '操作人员',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_OPER_TYPE),
      placeholder: '请选择',
    },
    fieldName: 'businessType',
    label: '操作类型',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'operIp',
    label: '操作IP',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_COMMON_STATUS),
      placeholder: '请选择',
    },
    fieldName: 'status',
    label: '状态',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '操作时间',
  },
];

export const columns: ColumnType[] = [
  {
    align: 'center',
    dataIndex: 'title',
    title: '系统模块',
  },
  {
    align: 'center',
    customRender({ value }) {
      return renderDict(value, DictEnum.SYS_OPER_TYPE);
    },
    dataIndex: 'businessType',
    title: '操作类型',
  },
  {
    align: 'center',
    dataIndex: 'operName',
    title: '操作人员',
  },
  {
    align: 'center',
    dataIndex: 'operIp',
    title: 'IP地址',
  },
  {
    align: 'center',
    dataIndex: 'operLocation',
    title: 'IP信息',
  },
  {
    align: 'center',
    customRender({ value }) {
      return renderDict(value, DictEnum.SYS_COMMON_STATUS);
    },
    dataIndex: 'status',
    title: '操作状态',
  },
  {
    align: 'center',
    dataIndex: 'operTime',
    sorter: true,
    title: '操作日期',
  },
  {
    align: 'center',
    customRender({ text }) {
      return `${text} ms`;
    },
    dataIndex: 'costTime',
    sorter: true,
    title: '操作耗时',
  },
  {
    align: 'center',
    dataIndex: 'action',
    fixed: 'right',
    title: '操作',
  },
];

export const descSchema: DescItem[] = [
  {
    field: 'operId',
    label: '日志编号',
  },
  {
    field: 'status',
    label: '操作结果',
    render(value) {
      return renderDict(value, DictEnum.SYS_COMMON_STATUS);
    },
  },
  {
    field: 'title',
    label: '操作模块',
    labelMinWidth: 80,
    render(value, { businessType }) {
      const operType = renderDict(businessType, DictEnum.SYS_OPER_TYPE);
      return (
        <div class="flex items-center">
          <Tag>{value}</Tag>
          {operType}
        </div>
      );
    },
  },
  {
    field: 'operIp',
    label: '操作信息',
    render(_, data) {
      return `账号: ${data.operName} / ${data.deptName} / ${data.operIp} / ${data.operLocation}`;
    },
  },
  {
    field: 'operUrl',
    label: '请求信息',
    render(_, data) {
      const { operUrl, requestMethod } = data;
      const methodTag = renderHttpMethodTag(requestMethod);
      return (
        <span>
          {methodTag} {operUrl}
        </span>
      );
    },
  },
  {
    field: 'errorMsg',
    label: '异常信息',
    render(value) {
      return <span class="font-bold text-red-600">{value}</span>;
    },
    show: (data) => {
      return data && data.errorMsg !== '';
    },
  },
  {
    field: 'method',
    label: '方法',
  },
  {
    field: 'operParam',
    label: '请求参数',
    render(value) {
      return (
        <div class="max-h-[300px] overflow-y-auto">
          {renderJsonPreview(value)}
        </div>
      );
    },
  },
  {
    field: 'jsonResult',
    label: '响应参数',
    render(value) {
      return (
        <div class="max-h-[300px] overflow-y-auto">
          {renderJsonPreview(value)}
        </div>
      );
    },
    show(data) {
      return data && data.jsonResult;
    },
  },
  {
    field: 'costTime',
    label: '耗时',
    render(value) {
      return `${value} ms`;
    },
  },
  {
    field: 'operTime',
    label: '操作时间',
  },
];
