import type { ColumnsType } from 'ant-design-vue/es/table';

import type { FormSchemaGetter } from '#/adapter';
import type { DescItem } from '#/components/description';

import { DictEnum } from '@vben/constants';

import { Tooltip } from 'ant-design-vue';

import { getDictOptions } from '#/utils/dict';
import { renderBrowserIcon, renderDict, renderOsIcon } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'ipaddr',
    label: 'IP地址',
  },
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户账号',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_COMMON_STATUS),
    },
    fieldName: 'status',
    label: '登录状态',
  },
  {
    component: 'RangePicker',
    fieldName: 'dateTime',
    label: '登录日期',
  },
];

export const columns: ColumnsType = [
  {
    align: 'center',
    dataIndex: 'userName',
    title: '用户账号',
  },
  {
    align: 'center',
    dataIndex: 'clientKey',
    title: '登录平台',
  },
  {
    align: 'center',
    dataIndex: 'ipaddr',
    title: 'IP地址',
  },
  {
    align: 'center',
    dataIndex: 'loginLocation',
    title: 'IP地点',
    width: 200,
  },
  {
    align: 'center',
    customRender({ value }) {
      return renderBrowserIcon(value, true);
    },
    dataIndex: 'browser',
    title: '浏览器',
  },
  {
    align: 'center',
    customRender({ value }) {
      // Windows 10 or Windows Server 2016 太长了 分割一下 详情依旧能看到详细的
      // 为什么不直接保存userAgent让前端解析 很奇怪
      if (value) {
        const split = value.split(' or ');
        if (split.length === 2) {
          value = split[0];
        }
      }
      return renderOsIcon(value, true);
    },
    dataIndex: 'os',
    title: '系统',
  },
  {
    align: 'center',
    customRender({ value }) {
      return renderDict(value, DictEnum.SYS_COMMON_STATUS);
    },
    dataIndex: 'status',
    title: '登录结果',
  },
  {
    align: 'center',
    customRender({ value }) {
      return (
        <Tooltip placement={'top'} title={value}>
          {value}
        </Tooltip>
      );
    },
    dataIndex: 'msg',
    ellipsis: true,
    title: '信息',
  },
  {
    align: 'center',
    dataIndex: 'loginTime',
    title: '日期',
  },
  {
    align: 'center',
    dataIndex: 'action',
    title: '操作',
  },
];

export const modalSchema: () => DescItem[] = () => [
  {
    field: 'status',
    label: '登录状态',
    labelMinWidth: 80,
    render(value) {
      return renderDict(value, DictEnum.SYS_COMMON_STATUS);
    },
  },
  {
    field: 'clientKey',
    label: '登录平台',
    render(value) {
      if (value) {
        return value.toUpperCase();
      }
      return '';
    },
  },
  {
    field: 'ipaddr',
    label: '账号信息',
    render(_, data) {
      const { ipaddr, loginLocation, userName } = data;
      return `账号: ${userName} / ${ipaddr} / ${loginLocation}`;
    },
  },
  {
    field: 'loginTime',
    label: '登录时间',
  },
  {
    field: 'msg',
    label: '登录信息',
    render(_, data: any) {
      const { msg, status } = data;
      return (
        <span class={['font-bold', status === '0' ? '' : 'text-red-500']}>
          {msg}
        </span>
      );
    },
  },
  {
    field: 'os',
    label: '登录设备',
    render(value) {
      return renderOsIcon(value);
    },
  },
  {
    field: 'browser',
    label: '浏览器',
    render(value) {
      return renderBrowserIcon(value);
    },
  },
];
