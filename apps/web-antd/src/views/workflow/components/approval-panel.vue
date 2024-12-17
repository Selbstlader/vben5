<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { computed, onUnmounted, ref, watch } from 'vue';

import { Fallback, useVbenModal, VbenAvatar } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';

import { useEventListener } from '@vueuse/core';
import {
  Card,
  Divider,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { flowInfo } from '#/api/workflow/instance';
import { terminationTask } from '#/api/workflow/task';
import { renderDict } from '#/utils/render';

import { approvalModal, approvalRejectionModal, ApprovalTimeline } from '.';

defineOptions({
  name: 'ApprovalPanel',
  inheritAttrs: false,
});

// eslint-disable-next-line no-use-before-define
const props = defineProps<{ task?: TaskInfo; type: ApprovalType }>();

/**
 * myself 我发起的
 * readonly 只读 只用于查看
 * approve 审批
 */
type ApprovalType = 'approve' | 'myself' | 'readonly';
const showFooter = computed(() => {
  if (props.type === 'readonly') {
    return false;
  }
  // 我发起的 && [已完成, 已作废] 不显示
  if (
    props.type === 'myself' &&
    ['finish', 'invalid'].includes(props.task?.flowStatus ?? '')
  ) {
    return false;
  }
  return true;
});

const currentFlowInfo = ref<FlowInfoResponse>();
/**
 * card的loading状态
 */
const loading = ref(false);
const iframeLoaded = ref(false);
useEventListener('message', (event) => {
  /**
   * iframe通信 加载完毕后才显示表单 解决卡顿问题
   */
  if (event.data === 'mounted') {
    iframeLoaded.value = true;
  }
});

async function handleLoadInfo(task: TaskInfo | undefined) {
  try {
    if (!task) return null;
    loading.value = true;
    iframeLoaded.value = false;
    const resp = await flowInfo(task.businessId);
    currentFlowInfo.value = resp;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

watch(() => props.task, handleLoadInfo);

onUnmounted(() => (currentFlowInfo.value = undefined));

async function handleCancel() {
  // await cancelProcessApply()
}

/**
 * 审批驳回
 */
const [RejectionModal, rejectionModalApi] = useVbenModal({
  connectedComponent: approvalRejectionModal,
});
function handleRejection() {
  rejectionModalApi.setData({
    taskId: props.task?.id,
    instanceId: props.task?.instanceId,
  });
  rejectionModalApi.open();
}

/**
 * 审批终止
 */
function handleTermination() {
  Modal.confirm({
    title: '审批终止',
    content: '确定终止当前审批流程吗？',
    centered: true,
    okButtonProps: { danger: true },
    onOk: async () => {
      await terminationTask({ taskId: props.task!.id });
    },
  });
}

/**
 * 审批通过
 */
const [ApprovalModal, approvalModalApi] = useVbenModal({
  connectedComponent: approvalModal,
});
function handleApproval() {
  approvalModalApi.setData({ taskId: props.task?.id });
  approvalModalApi.open();
}
</script>

<template>
  <Card
    v-if="task"
    :body-style="{ overflowY: 'auto', height: '100%' }"
    :loading="loading"
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
          <VbenAvatar
            :alt="task.createByName"
            class="bg-primary size-[24px] rounded-full text-white"
            src=""
          />
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
            <!-- 约定${task.formPath}/frame 为内嵌表单 用于展示 需要在本地路由添加 -->
            <iframe
              v-show="iframeLoaded"
              :src="`${task.formPath}/iframe?readonly=true&id=${task.businessId}`"
              class="h-[300px] w-full"
            ></iframe>
            <Skeleton v-show="!iframeLoaded" :paragraph="{ rows: 6 }" active />
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
    <div class="h-[57px]"></div>
    <div
      v-if="showFooter"
      class="border-t-solid bg-background absolute bottom-0 left-0 w-full border-t-[1px] p-3"
    >
      <div class="flex justify-end">
        <Space v-if="type === 'myself'">
          <Popconfirm
            placement="topRight"
            title="确定要撤销该申请吗？"
            @confirm="handleCancel"
          >
            <a-button danger type="primary">撤销申请</a-button>
          </Popconfirm>
        </Space>
        <Space v-if="type === 'approve'">
          <a-button type="primary" @click="handleApproval">通过</a-button>
          <a-button danger type="primary" @click="handleTermination">
            终止
          </a-button>
          <a-button danger type="primary" @click="handleRejection">
            驳回
          </a-button>
          <a-button>其他</a-button>
          <ApprovalModal />
          <RejectionModal />
        </Space>
      </div>
    </div>
  </Card>
  <Fallback v-else title="点击左侧选择" />
</template>
