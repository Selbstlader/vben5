<script setup lang="ts">
import type { TaskInfo } from '#/api/workflow/task/model';

import { VbenAvatar } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { Descriptions, DescriptionsItem } from 'ant-design-vue';

import { renderDict } from '#/utils/render';

interface Props extends TaskInfo {
  active: boolean;
}

const props = withDefaults(defineProps<{ info: Props; rowKey?: string }>(), {
  rowKey: 'id',
});

const emit = defineEmits<{ click: [string] }>();

/**
 * TODO: 这里要优化 事件没有用到
 */
function handleClick() {
  console.log('click');
  const idKey = props.rowKey as keyof TaskInfo;
  emit('click', props.info[idKey]);
}
</script>

<template>
  <div
    :class="{
      'border-primary': info.active,
      'border-[2px]': info.active,
    }"
    class="cursor-pointer rounded-lg border-[1px] border-solid p-3 transition-shadow duration-300 ease-in-out hover:shadow-lg"
    @click.stop="handleClick"
  >
    <Descriptions :column="1" :title="info.flowName" size="middle">
      <template #extra>
        <component
          :is="renderDict(info.flowStatus, DictEnum.WF_BUSINESS_STATUS)"
        />
      </template>
      <DescriptionsItem label="当前节点名称">
        <div class="font-bold">{{ info.nodeName }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="开始时间">
        {{ info.createTime }}
      </DescriptionsItem>
      <!-- <DescriptionsItem label="更新时间">
        {{ info.updateTime }}
      </DescriptionsItem> -->
    </Descriptions>
    <div class="flex w-full items-center justify-between text-[14px]">
      <div class="flex items-center gap-1 overflow-hidden whitespace-nowrap">
        <VbenAvatar
          :alt="info.createByName"
          class="bg-primary size-[24px] rounded-full text-[10px] text-white"
          src=""
        />
        <span class="overflow-hidden text-ellipsis opacity-50">
          {{ info.createByName }}
        </span>
      </div>
      <div class="text-nowrap opacity-50">{{ info.updateTime }}更新</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-descriptions .ant-descriptions-header) {
  margin-bottom: 12px !important;
}

:deep(.ant-descriptions-item) {
  padding-bottom: 8px !important;
}
</style>
