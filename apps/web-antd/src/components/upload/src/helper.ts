import { fileTypeFromBlob } from '@vben/utils';

/**
 * TODO: file-upload暂时使用 需要进行重构
 * @param file file对象
 * @param accepts 文件类型数组  包括拓展名(不带点) 文件头(image/png等 不包括泛写法即image/*)
 * @returns 是否通过文件类型校验
 */
export function checkFileType(file: File, accepts: string[]) {
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(?:jpg|jpeg|png|gif|webp)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp(`${String.raw`\.(` + newTypes})$`, 'i');
  }
  return reg.test(file.name);
}

/**
 * 默认图片类型
 */
export const defaultImageAccept = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
/**
 * 判断文件类型是否符合要求
 * @param file file对象
 * @param accepts 文件类型数组  包括拓展名(不带点) 文件头(image/png等 不包括泛写法即image/*)
 * @returns 是否通过文件类型校验
 */
export async function checkImageFileType(file: File, accepts: string[]) {
  // 空的accepts 使用默认规则
  if (!accepts || accepts.length === 0) {
    accepts = defaultImageAccept;
  }
  const fileType = await fileTypeFromBlob(file);
  if (!fileType) {
    console.error('无法获取文件类型');
    return false;
  }
  console.log('文件类型', fileType);
  // 是否文件拓展名/文件头任意有一个匹配
  if (accepts.includes(fileType.ext) || accepts.includes(fileType.mime)) {
    return true;
  }
  return false;
}
