import type { UpdatePasswordParam, UserProfile } from './model';

import { requestClient } from '#/api/request';

enum Api {
  root = '/system/user/profile',
  updateAvatar = '/system/user/profile/avatar',
  updatePassword = '/system/user/profile/updatePwd',
}

/**
 * 用户个人主页信息
 * @returns userInformation
 */
export function userProfile() {
  return requestClient.get<UserProfile>(Api.root);
}

/**
 * 更新用户个人主页信息
 * @param data
 * @returns void
 */
export function userProfileUpdate(data: any) {
  return requestClient.putWithMsg<void>(Api.root, data);
}

/**
 * 用户修改密码 (需要加密)
 * @param data
 * @returns void
 */
export function userUpdatePassword(data: UpdatePasswordParam) {
  return requestClient.putWithMsg<void>(Api.updatePassword, data, {
    encrypt: true,
  });
}
