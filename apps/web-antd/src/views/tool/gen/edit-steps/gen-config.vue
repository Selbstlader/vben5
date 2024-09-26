<script setup lang="ts">
import type { GenInfo } from '#/api/tool/gen/model';

import { inject, type Ref, unref } from 'vue';

import { Space, Table } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { editSave } from '#/api/tool/gen';

import { toCurrentStep } from '../mitt';

/**
 * 从父组件注入
 */
const genInfoData = inject('genInfoData') as Ref<GenInfo['info']>;

async function handleSubmit() {
  try {
    const requestData = cloneDeep(unref(genInfoData));
    // 树表需要添加这个参数
    if (requestData && requestData.tplCategory === 'tree') {
      const { parentMenuId, treeCode, treeName, treeParentCode } = requestData;
      requestData.params = {
        parentMenuId,
        treeCode,
        treeName,
        treeParentCode,
      };
    }
    // 需要进行参数转化
    if (requestData) {
      const transform = (ret: boolean) => (ret ? '1' : '0');
      requestData.columns.forEach((column) => {
        const { edit, insert, query, required, list } = column;
        column.isInsert = transform(insert);
        column.isEdit = transform(edit);
        column.isList = transform(list);
        column.isQuery = transform(query);
        column.isRequired = transform(required);
      });
    }
    await editSave(requestData);
    // 跳转到成功页面
    toCurrentStep(2);
  } catch (error: unknown) {
    console.error(error);
  }
}
</script>

<template>
  <div class="flex flex-col gap-[16px] p-[12px]">
    <Table />
    <div class="flex justify-center">
      <Space>
        <a-button @click="toCurrentStep(0)">上一步</a-button>
        <a-button type="primary" @click="handleSubmit">下一步</a-button>
      </Space>
    </div>
  </div>
</template>
