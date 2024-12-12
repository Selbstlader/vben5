<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { computed, onMounted, ref } from 'vue';

import { Fallback, Page, VbenAvatar } from '@vben/common-ui';

import {
  Card,
  Divider,
  Empty,
  InputSearch,
  Space,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';
import { debounce } from 'lodash-es';

import { flowInfo } from '#/api/workflow/instance';
import { pageByTaskWait } from '#/api/workflow/task';

import { ApprovalCard, ApprovalTimeline } from '../components';

const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

const taskList = ref<({ active: boolean } & TaskInfo)[]>([]);
const taskTotal = ref(0);
const page = ref(1);

/**
 * 是否已经加载全部数据 即 taskList.length === taskTotal
 */
const isLoadComplete = computed(
  () => taskList.value.length === taskTotal.value,
);

onMounted(async () => {
  /**
   * 获取待办任务列表
   */
  const resp = await pageByTaskWait({ pageSize: 10, pageNum: page.value });
  console.log(resp);
  taskList.value = resp.rows.map((item) => ({ ...item, active: false }));
  taskTotal.value = resp.total;
});

const handleScroll = debounce(async (e: Event) => {
  if (!e.target) {
    return;
  }
  // e.target.scrollTop 是元素顶部到当前可视区域顶部的距离，即已滚动的高度。
  // e.target.clientHeight 是元素的可视高度。
  // e.target.scrollHeight 是元素的总高度。
  const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement;
  // 判断是否滚动到底部
  const isBottom = scrollTop + clientHeight >= scrollHeight;

  // 滚动到底部且没有加载完成
  if (isBottom && !isLoadComplete.value) {
    page.value += 1;
    const resp = await pageByTaskWait({ pageSize: 10, pageNum: page.value });
    taskList.value.push(
      ...resp.rows.map((item) => ({ ...item, active: false })),
    );
  }
}, 200);

const currentInstance = ref<FlowInfoResponse>();

const lastSelectId = ref('');
async function handleCardClick(item: TaskInfo) {
  const { id, businessId } = item;
  // 点击的是同一个
  if (lastSelectId.value === id) {
    return;
  }
  // 反选状态 & 如果已经点击了 不变 & 保持只能有一个选中
  taskList.value.forEach((item) => {
    item.active = item.id === id;
  });
  lastSelectId.value = id;

  const resp = await flowInfo(businessId);
  currentInstance.value = resp;
}

const instanceInfo = computed(() => {
  if (!currentInstance.value) {
    return;
  }
  const length = currentInstance.value.list.length;
  if (length === 2) {
    return;
  }
  // 最末尾为申请人
  const info = currentInstance.value.list[length - 1]!;
  return {
    id: info.instanceId,
    createTime: info.createTime,
    approveName: info.approveName,
    flowName: info.flowName ?? '未知流程',
    businessId: '1867081791031750658',
  };
});
</script>

<template>
  <Page :auto-content-height="true">
    <div class="flex h-full gap-2">
      <div
        class="bg-background flex h-full min-w-[320px] max-w-[320px] flex-col rounded-lg"
      >
        <!-- 搜索条件 -->
        <div
          class="bg-background z-100 sticky left-0 top-0 w-full rounded-t-lg border-b-[1px] border-solid p-2"
        >
          <InputSearch placeholder="搜索任务名称" />
        </div>
        <div
          class="thin-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto py-3"
          @scroll="handleScroll"
        >
          <template v-if="taskList.length > 0">
            <ApprovalCard
              v-for="item in taskList"
              :key="item.id"
              :info="item"
              class="mx-2"
              @click="handleCardClick(item)"
            />
          </template>
          <Empty v-else :image="emptyImage" />
        </div>
        <!-- total显示 -->
        <div
          class="bg-background sticky bottom-0 w-full rounded-b-lg border-t-[1px] py-2"
        >
          <div class="flex items-center justify-center">
            共 {{ taskList.length }} 条记录
          </div>
        </div>
      </div>
      <Card
        v-if="currentInstance && instanceInfo"
        :body-style="{ overflowY: 'auto', height: '100%' }"
        :title="`编号: ${instanceInfo.id}`"
        class="thin-scrollbar flex-1 overflow-y-hidden"
        size="small"
      >
        <div class="flex flex-col gap-5 p-4">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="text-2xl font-bold">{{ instanceInfo.flowName }}</div>
              <div>
                <Tag color="warning">申请中</Tag>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <VbenAvatar
                :alt="instanceInfo.approveName"
                class="size-[24px]"
                src=""
              />
              <span>{{ instanceInfo.approveName }}</span>
              <div class="flex items-center opacity-50">
                <span>XXXX有限公司</span>
                <Divider type="vertical" />
                <span>提交于: {{ instanceInfo.createTime }}</span>
              </div>
            </div>
          </div>
          <Tabs class="flex-1">
            <TabPane key="1" tab="审批详情">
              <div class="h-fulloverflow-y-auto">
                <!-- <Alert message="该页面仅为静态页 后期可能会用到!" type="info" /> -->
                <iframe
                  :src="`/workflow/leave-inner?readonly=true&id=${instanceInfo.businessId}`"
                  class="h-[300px] w-full"
                ></iframe>
                <Divider />
                <ApprovalTimeline :list="currentInstance.list" />
              </div>
            </TabPane>
            <TabPane key="2" tab="审批流程图">
              <img
                :src="`data:image/png;base64,${currentInstance.image}`"
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
    </div>
  </Page>
</template>

<style lang="scss" scoped>
.thin-scrollbar {
  &::-webkit-scrollbar {
    width: 5px;
  }
}

:deep(.ant-card-body) {
  @apply thin-scrollbar;
}
</style>
