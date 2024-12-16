<script setup lang="ts">
import type { Flow } from '#/api/workflow/instance/model';

import { onMounted, ref } from 'vue';

import { VbenAvatar } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { TimelineItem } from 'ant-design-vue';

import { ossInfo } from '#/api/system/oss';
import { renderDict } from '#/utils/render';

defineOptions({
  name: 'ApprovalTimelineItem',
  inheritAttrs: false,
});

const props = defineProps<{ item: Flow }>();

interface AttachmentInfo {
  ossId: string;
  url: string;
  name: string;
}

/**
 * 处理附件信息
 */
const attachmentInfo = ref<AttachmentInfo[]>([]);
onMounted(async () => {
  if (!props.item.ext) {
    return null;
  }
  const resp = await ossInfo(props.item.ext.split(','));
  attachmentInfo.value = resp.map((item) => ({
    ossId: item.ossId,
    url: item.url,
    name: item.originalName,
  }));
});
</script>

<template>
  <TimelineItem :key="item.id">
    <template #dot>
      <div class="relative rounded-full border">
        <VbenAvatar :alt="item.approveName" class="size-[36px]" src="" />
      </div>
    </template>
    <div class="ml-2 flex flex-col gap-0.5">
      <div class="flex items-center gap-1">
        <div class="font-bold">{{ item.nodeName }}</div>
        <component :is="renderDict(item.flowStatus, DictEnum.WF_TASK_STATUS)" />
      </div>
      <div>{{ item.approveName }}</div>
      <div>{{ item.updateTime }}</div>
      <div v-if="item.message" class="rounded-lg border p-1">
        <span class="opacity-70">{{ item.message }}</span>
      </div>
      <div v-if="attachmentInfo.length > 0" class="flex flex-wrap gap-2">
        <!-- 这里下载的文件名不是原始文件名 -->
        <a
          v-for="attachment in attachmentInfo"
          :key="attachment.ossId"
          :href="attachment.url"
          class="text-primary"
        >
          {{ attachment.name }}
        </a>
      </div>
    </div>
  </TimelineItem>
</template>
