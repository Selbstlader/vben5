import type { DictData } from '#/api/system/dict/dict-data-model';

import { dictDataInfo } from '#/api/system/dict/dict-data';
import { type Option, useDictStore } from '#/store/dict';
// todo 重复代码的封装
/**
 * 添加一个字典请求状态的缓存
 *
 * 主要解决多次请求重复api的问题(不能用abortController 会导致除了第一个其他的获取的全为空)
 * 比如在一个页面 index表单 modal drawer总共会请求三次 但是获取的都是一样的数据
 */
const dictRequestCache = new Map<string, Promise<DictData[] | void>>();

export function getDict(dictName: string): DictData[] {
  const { getDict, setDictInfo } = useDictStore();
  // 这里拿到
  const dictList = getDict(dictName);
  if (
    dictList.length === 0 && // 检查请求状态缓存
    !dictRequestCache.has(dictName)
  ) {
    dictRequestCache.set(
      dictName,
      dictDataInfo(dictName).then((resp) => {
        // 缓存到store 这样就不用重复获取了
        // 内部处理了push的逻辑 这里不用push
        setDictInfo(dictName, resp);
        // 移除请求状态缓存
        dictRequestCache.delete(dictName);
      }),
    );
  }
  return dictList;
}

export function getDictOptions(dictName: string): Option[] {
  const { getDictOptions, setDictInfo } = useDictStore();
  const dictOptionList = getDictOptions(dictName);
  if (
    dictOptionList.length === 0 && // 检查请求状态缓存
    !dictRequestCache.has(dictName)
  ) {
    dictRequestCache.set(
      dictName,
      dictDataInfo(dictName).then((resp) => {
        // 缓存到store 这样就不用重复获取了
        // 内部处理了push的逻辑 这里不用push
        setDictInfo(dictName, resp);
        // 移除请求状态缓存
        dictRequestCache.delete(dictName);
      }),
    );
  }
  return dictOptionList;
}
