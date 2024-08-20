import { useAppConfig } from '@vben/hooks';

import { requestClient } from '#/api/request';

const { clientId } = useAppConfig(import.meta.env, import.meta.env.PROD);

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    code?: string;
    grantType: string;
    password: string;
    tenantId: string;
    username: string;
    uuid?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    client_id: string;
    expire_in: number;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>(
    '/auth/login',
    { ...data, clientId },
    {
      encrypt: true,
    },
  );
}

/**
 * 用户登出
 * @returns void
 */
export function doLogout() {
  return requestClient.post<void>('/auth/logout');
}

/**
 * @param companyName 租户/公司名称
 * @param domain 绑定域名(不带http(s)://) 可选
 * @param tenantId 租户id
 */
export interface TenantOption {
  companyName: string;
  domain?: string;
  tenantId: string;
}

/**
 * @param tenantEnabled 是否启用租户
 * @param voList 租户列表
 */
export interface TenantResp {
  tenantEnabled: boolean;
  voList: TenantOption[];
}

/**
 * 获取租户列表 下拉框使用
 */
export function tenantList() {
  return requestClient.get<TenantResp>('/auth/tenant/list');
}

export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
