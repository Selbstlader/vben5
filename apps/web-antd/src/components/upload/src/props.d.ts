import type { UploadApi } from '#/api';

export interface BaseUploadProps {
  /**
   * 上传接口
   */
  api?: UploadApi;
  /**
   * 文件上传失败 是否从展示列表中删除
   * @default true
   */
  removeOnError?: boolean;
  /**
   * 上传成功 是否展示提示信息
   * @default true
   */
  showSuccessMsg?: boolean;
  /**
   * 删除文件前是否需要确认
   * @default false
   */
  removeConfirm?: boolean;
  /**
   * 同antdv参数
   */
  accept?: string;
  /**
   * 附带的请求参数
   */
  data?: any;
  /**
   * 最大上传图片数量
   * maxCount为1时 会被绑定为string而非string[]
   * @default 1
   */
  maxCount?: number;
  /**
   * 文件最大 单位M
   * @default 5
   */
  maxSize?: number;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否显示文案 请上传不超过...
   * @default true
   */
  helpMessage?: boolean;
  /**
   * 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件。
   * @default false
   */
  multiple?: boolean;
  /**
   * 是否支持上传文件夹
   * @default false
   */
  directory?: boolean;
}
