<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { Empty, InputSearch } from 'ant-design-vue';
import { debounce } from 'lodash-es';

import { flowInfo, pageByCurrent } from '#/api/workflow/instance';

import { ApprovalCard, ApprovalPanel } from '../components';

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
  const resp = await pageByCurrent({ pageSize: 10, pageNum: page.value });
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
    const resp = await pageByCurrent({ pageSize: 10, pageNum: page.value });
    taskList.value.push(
      ...resp.rows.map((item) => ({ ...item, active: false })),
    );
  }
}, 200);

const currentInstance = ref<FlowInfoResponse>();

const lastSelectId = ref('');
const currentTask = ref<TaskInfo>();
async function handleCardClick(item: TaskInfo) {
  const { id, businessId } = item;
  // 点击的是同一个
  if (lastSelectId.value === id) {
    return;
  }
  currentTask.value = item;
  // 反选状态 & 如果已经点击了 不变 & 保持只能有一个选中
  taskList.value.forEach((item) => {
    item.active = item.id === id;
  });
  lastSelectId.value = id;

  const resp = await flowInfo(businessId);
  currentInstance.value = resp;
}

const { refreshTab } = useTabs();
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
          <InputSearch placeholder="搜索还没做" />
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
            共 {{ taskTotal }} 条记录
          </div>
        </div>
      </div>
      <ApprovalPanel :task="currentTask" type="myself" @reload="refreshTab" />
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
