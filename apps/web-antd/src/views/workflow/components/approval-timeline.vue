<script setup lang="ts">
import type { Flow } from '#/api/workflow/instance/model';

import { Timeline, TimelineItem } from 'ant-design-vue';

/**
 * TODO: 仅为demo 后期会替换
 */
import { VbenAvatar } from '@vben/common-ui';

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
          <div
            class="border-background absolute bottom-0 right-0 size-[16px] rounded-full border-2 bg-green-500 content-['']"
          >
            <div class="flex items-center justify-center">
              <span class="icon-[mdi--success-bold] text-white"></span>
            </div>
          </div>
        </div>
      </template>
      <div class="ml-2 flex flex-col gap-0.5">
        <div class="font-bold">{{ item.nodeName }}</div>
        <div>{{ item.approveName }}</div>
        <div>{{ item.updateTime }}</div>
        <div v-if="item.message" class="rounded-lg border p-1">
          <span class="opacity-70">{{ item.message }}</span>
        </div>
      </div>
    </TimelineItem>
  </Timeline>
</template>
