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
   * 你可能使用的是application/pdf这种mime类型, 但是这样用户可能看不懂, 在这里自定义逻辑
   * @default 原始accept
   */
  acceptFormat?: ((accept: string) => string) | string;
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
  /**
   * 是否支持拖拽上传
   * @default false
   */
  enableDragUpload?: boolean;
  /**
   * 是否开启深度监听
   * 默认外部的数组地址重新改变才会触发watch 不会监听内部元素的变化
   * 开启后 无论内部还是外部改变都会触发查询信息接口(包括上传后, 删除等操作都会触发)
   * @default false
   */
  deepWatch?: boolean;
  /**
   * 当ossId查询不到文件信息时  比如被删除了
   * 是否保留列表对应的ossId 默认不保留
   * @default false
   */
  keepMissingId?: boolean;
  /**
   * 自定义文件/图片预览逻辑 比如: 你可以改为下载
   * 图片上传默认为预览
   * 文件上传默认为window.open
   * @param file file
   */
  preview?: (file: UploadFile) => Promise<void> | void;
}
