<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { Empty, InputSearch, Segmented } from 'ant-design-vue';
import { debounce, uniqueId } from 'lodash-es';

import { flowInfo } from '#/api/workflow/instance';
import { pageByAllTaskFinish, pageByAllTaskWait } from '#/api/workflow/task';

import { ApprovalCard, ApprovalPanel } from '../components';

const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

/**
 * 流程监控 - 待办任务页面的id不唯一 改为前端处理
 */
interface TaskItem extends TaskInfo {
  active: boolean;
  randomId: string;
}

const taskList = ref<TaskItem[]>([]);
const taskTotal = ref(0);
const page = ref(1);

const typeOptions = [
  { label: '待办任务', value: 'todo' },
  { label: '已办任务', value: 'done' },
];
const currentType = ref('todo');
const currentApi = computed(() => {
  if (currentType.value === 'todo') {
    return pageByAllTaskWait;
  }
  return pageByAllTaskFinish;
});
const approvalType = computed(() => {
  if (currentType.value === 'done') {
    return 'readonly';
  }
  return 'admin';
});
async function handleTypeChange() {
  page.value = 1;
  const resp = await currentApi.value({ pageSize: 10, pageNum: page.value });
  taskList.value = resp.rows.map((item) => ({
    ...item,
    active: false,
    randomId: uniqueId(),
  }));
  taskTotal.value = resp.total;
  // eslint-disable-next-line no-use-before-define
  currentTask.value = undefined;
}

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
  const resp = await currentApi.value({ pageSize: 10, pageNum: page.value });
  console.log(resp);
  taskList.value = resp.rows.map((item) => ({
    ...item,
    active: false,
    randomId: uniqueId(),
  }));
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
    const resp = await currentApi.value({ pageSize: 10, pageNum: page.value });
    taskList.value.push(
      ...resp.rows.map((item) => ({
        ...item,
        active: false,
        randomId: uniqueId(),
      })),
    );
  }
}, 200);

const currentInstance = ref<FlowInfoResponse>();

const lastSelectId = ref('');
const currentTask = ref<TaskInfo>();
async function handleCardClick(item: TaskItem) {
  const { randomId, businessId } = item;
  // 点击的是同一个
  if (lastSelectId.value === randomId) {
    return;
  }
  currentTask.value = item;
  // 反选状态 & 如果已经点击了 不变 & 保持只能有一个选中
  taskList.value.forEach((item) => {
    item.active = item.randomId === randomId;
  });
  lastSelectId.value = randomId;

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
          <Segmented
            v-model:value="currentType"
            :options="typeOptions"
            block
            class="mb-2"
            @change="handleTypeChange"
          />
          <InputSearch placeholder="搜索还没做" />
        </div>
        <div
          class="thin-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto py-3"
          @scroll="handleScroll"
        >
          <template v-if="taskList.length > 0">
            <ApprovalCard
              v-for="item in taskList"
              :key="item.randomId"
              :info="item"
              class="mx-2"
              row-key="randomId"
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
      <ApprovalPanel
        :task="currentTask"
        :type="approvalType"
        @reload="refreshTab"
      />
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
