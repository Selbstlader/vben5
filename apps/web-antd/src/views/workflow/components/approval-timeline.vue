<script setup lang="ts">
import type { Flow } from '#/api/workflow/instance/model';

import { Timeline, TimelineItem } from 'ant-design-vue';

/**
 * TODO: 仅为demo 后期会替换
 */
import { VbenAvatar } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { renderDict } from '#/utils/render';

const props = defineProps<{
  list: Flow[];
}>();
</script>

<template>
  <Timeline>
    <TimelineItem v-for="item in props.list" :key="item.id">
      <template #dot>
        <div class="relative rounded-full border">
          <VbenAvatar :alt="item.approveName" class="size-[36px]" src="" />
        </div>
      </template>
      <div class="ml-2 flex flex-col gap-0.5">
        <div class="flex items-center gap-1">
          <div class="font-bold">{{ item.nodeName }}</div>
          <component
            :is="renderDict(item.flowStatus, DictEnum.WF_TASK_STATUS)"
          />
        </div>
        <div>{{ item.approveName }}</div>
        <div>{{ item.updateTime }}</div>
        <div v-if="item.message" class="rounded-lg border p-1">
          <span class="opacity-70">{{ item.message }}</span>
        </div>
      </div>
    </TimelineItem>
  </Timeline>
</template>
