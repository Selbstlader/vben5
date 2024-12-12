import type { FlowInfoResponse } from './model';

import { requestClient } from '#/api/request';

/**
 * 获取流程图，流程记录
 * @param businessId 业务标识
 * @returns 流程图，流程记录
 */
export function flowInfo(businessId: string) {
  return requestClient.get<FlowInfoResponse>(
    `/workflow/instance/flowImage/${businessId}`,
  );
}
