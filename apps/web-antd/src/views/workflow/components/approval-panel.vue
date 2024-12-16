<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { onUnmounted, ref, watch } from 'vue';

import { Fallback, VbenAvatar } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { Card, Divider, Space, TabPane, Tabs } from 'ant-design-vue';

import { flowInfo } from '#/api/workflow/instance';
import { renderDict } from '#/utils/render';

import { ApprovalTimeline } from '.';

defineOptions({
  name: 'ApprovalPanel',
  inheritAttrs: false,
});

const props = defineProps<{ task?: TaskInfo }>();

const currentFlowInfo = ref<FlowInfoResponse>();

async function handleLoadInfo(task: TaskInfo | undefined) {
  if (!task) return null;
  const resp = await flowInfo(task.businessId);
  currentFlowInfo.value = resp;
}

watch(() => props.task, handleLoadInfo);

onUnmounted(() => (currentFlowInfo.value = undefined));
</script>

<template>
  <Card
    v-if="task"
    :body-style="{ overflowY: 'auto', height: '100%' }"
    :title="`编号: ${task.id}`"
    class="thin-scrollbar flex-1 overflow-y-hidden"
    size="small"
  >
    <template #extra>
      <a-button size="small" @click="() => handleLoadInfo(task)">
        <div class="flex items-center justify-center">
          <span class="icon-[material-symbols--refresh] size-24px"></span>
        </div>
      </a-button>
    </template>
    <div class="flex flex-col gap-5 p-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <div class="text-2xl font-bold">{{ task.flowName }}</div>
          <div>
            <component
              :is="renderDict(task.flowStatus, DictEnum.WF_BUSINESS_STATUS)"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <VbenAvatar :alt="task.createByName" class="size-[24px]" src="" />
          <span>{{ task.createByName }}</span>
          <div class="flex items-center opacity-50">
            <span>XXXX有限公司</span>
            <Divider type="vertical" />
            <span>提交于: {{ task.createTime }}</span>
          </div>
        </div>
      </div>
      <Tabs v-if="currentFlowInfo" class="flex-1">
        <TabPane key="1" tab="审批详情">
          <div class="h-fulloverflow-y-auto">
            <!-- <Alert message="该页面仅为静态页 后期可能会用到!" type="info" /> -->
            <iframe
              :src="`/workflow/leave-inner?readonly=true&id=${task.businessId}`"
              class="h-[300px] w-full"
            ></iframe>
            <Divider />
            <ApprovalTimeline :list="currentFlowInfo.list" />
          </div>
        </TabPane>
        <TabPane key="2" tab="审批流程图">
          <img
            :src="`data:image/png;base64,${currentFlowInfo.image}`"
            class="rounded-lg border"
          />
        </TabPane>
      </Tabs>
    </div>
    <!-- 固定底部 -->
    <div
      class="border-t-solid bg-background absolute bottom-0 left-0 w-full border-t-[1px] p-3"
    >
      <div class="flex justify-end">
        <Space>
          <a-button type="primary">通过</a-button>
          <a-button danger type="primary">驳回</a-button>
          <a-button>其他</a-button>
        </Space>
      </div>
    </div>
  </Card>
  <Fallback v-else title="点击左侧选择" />
</template>
