import { requestClient } from '#/api/request';

enum Api {
  root = '/system/tenant',
  tenantDynamic = '/system/tenant/dynamic',
  tenantDynamicClear = '/system/tenant/dynamic/clear',
  tenantExport = '/system/tenant/export',
  tenantList = '/system/tenant/list',
  tenantStatus = '/system/tenant/changeStatus',
  tenantSyncPackage = '/system/tenant/syncTenantPackage',
}

/**
 * 动态切换租户
 * @param tenantId 租户ID
 * @returns void
 */
export function tenantDynamicToggle(tenantId: string) {
  return requestClient.get<void>(`${Api.tenantDynamic}/${tenantId}`);
}

/**
 * 清除 动态切换租户
 * @returns void
 */
export function tenantDynamicClear() {
  return requestClient.get<void>(Api.tenantDynamicClear);
}
