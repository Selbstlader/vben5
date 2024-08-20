import { requestClient } from '#/api/request';

export function commonUploadApi(file: Blob | File) {
  return requestClient.upload('/resource/oss/upload', file);
}
/**
 * 默认上传结果
 */
export interface UploadResult {
  url: string;
  fileName: string;
  ossId: string;
}
