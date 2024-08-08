import type { DictData } from '#/api/system/dict/dict-data-model';

import { reactive } from 'vue';

import { defineStore } from 'pinia';

/**
 * antd使用 select和radio通用
 */
export interface Option {
  disabled?: boolean;
  label: string;
  value: string;
}

export function dictToOptions(data: DictData[]): Option[] {
  return data.map((item) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
}

export const useDictStore = defineStore('app-dict', () => {
  /**
   * 一般是dictTag使用
   */
  const dictMap = reactive(new Map<string, DictData[]>());
  /**
   * select radio radioButton使用 只能为固定格式(Option)
   */
  const dictOptionsMap = reactive(new Map<string, Option[]>());

  function getDict(dictName: string): DictData[] {
    if (!dictName) return [];
    // 没有key 添加一个空数组
    if (!dictMap.has(dictName)) {
      dictMap.set(dictName, reactive([]));
    }
    // 这里拿到的就不可能为空了
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return dictMap.get(dictName)!;
  }

  function getDictOptions(dictName: string): Option[] {
    if (!dictName) return [];
    // 没有key 添加一个空数组
    if (!dictOptionsMap.has(dictName)) {
      dictOptionsMap.set(dictName, []);
    }
    // 这里拿到的就不可能为空了
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return dictOptionsMap.get(dictName)!;
  }

  function resetCache() {
    dictMap.clear();
    dictOptionsMap.clear();
  }

  /**
   * 核心逻辑
   *
   * 不能直接粗暴使用set 会导致之前return的空数组跟现在的数组指向不是同一个地址  数据也就为空了
   *
   * 判断是否已经存在key 并且数组长度为0 说明该次要处理的数据是return的空数组 直接push(不修改指向)
   * 否则 直接set
   *
   */
  function setDictInfo(dictName: string, dictValue: DictData[]) {
    if (dictMap.has(dictName) && dictMap.get(dictName)?.length === 0) {
      dictMap.get(dictName)?.push(...dictValue);
    } else {
      dictMap.set(dictName, dictValue);
    }
    if (
      dictOptionsMap.has(dictName) &&
      dictOptionsMap.get(dictName)?.length === 0
    ) {
      dictOptionsMap.get(dictName)?.push(...dictToOptions(dictValue));
    } else {
      dictOptionsMap.set(dictName, dictToOptions(dictValue));
    }
  }

  function $reset() {
    resetCache();
  }

  return {
    $reset,
    dictMap,
    dictOptionsMap,
    getDict,
    getDictOptions,
    resetCache,
    setDictInfo,
  };
});
