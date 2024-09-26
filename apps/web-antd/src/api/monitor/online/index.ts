import type { OnlineUser } from './model';

import type { PageQuery } from '#/api/common';

import { requestClient } from '#/api/request';

enum Api {
  onlineList = '/monitor/online/list',
  root = '/monitor/online',
}

/**
 * 当前账号的在线设备 个人中心使用
 * @returns OnlineUser[]
 */
export function onlineDeviceList() {
  return requestClient.get<OnlineUser[]>(Api.root);
}

export function onlineList(params?: PageQuery) {
  return requestClient.get<OnlineUser[]>(Api.onlineList, { params });
}

/**
 * 强制下线
 * @param tokenId 用户token
 * @returns void
 */
export function forceLogout(tokenId: string) {
  return requestClient.delete<void>(`${Api.root}/${tokenId}`);
}

/**
 * 个人中心用的 跟上面的不同是用的Post
 * @param tokenId 用户token
 * @returns void
 */
export function forceLogout2(tokenId: string) {
  return requestClient.post<void>(`${Api.root}/${tokenId}`);
}
