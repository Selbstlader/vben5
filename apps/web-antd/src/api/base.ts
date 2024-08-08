import { requestClient } from './request';

export type ID = number | string;
export type IDS = (number | string)[];

export interface BaseEntity {
  createBy?: string;
  createDept?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

/**
 * 分页查询参数
 * @param pageNum 当前页
 * @param pageSize 每页大小
 * @param orderByColumn 排序字段
 * @param isAsc 是否升序
 */
export interface PageQuery {
  isAsc?: boolean;
  orderByColumn?: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // json
  JSON = 'application/json;charset=UTF-8',
}

/**
 * 通用下载接口 封装一层
 * @param url 请求地址
 * @param data  请求参数
 * @returns blob二进制
 */
export function commonExport(url: string, data: Record<string, any>) {
  return requestClient.post<Blob>(url, data, {
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    isTransformResponse: false,
    responseType: 'blob',
  });
}
