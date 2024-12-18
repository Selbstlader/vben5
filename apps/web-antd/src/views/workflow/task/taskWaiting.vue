<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { computed, onMounted, ref, useTemplateRef } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { FilterOutlined, RedoOutlined } from '@ant-design/icons-vue';
import {
  Empty,
  Form,
  FormItem,
  Input,
  InputSearch,
  Popover,
  Spin,
} from 'ant-design-vue';
import { cloneDeep, debounce } from 'lodash-es';

import { flowInfo } from '#/api/workflow/instance';
import { pageByTaskWait } from '#/api/workflow/task';

import { ApprovalCard, ApprovalPanel } from '../components';

const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

const taskList = ref<({ active: boolean } & TaskInfo)[]>([]);
const taskTotal = ref(0);
const page = ref(1);
const loading = ref(false);

const defaultFormData = {
  flowName: '', // 流程定义名称
  nodeName: '', // 任务名称
  flowCode: '', // 流程定义编码
};
const formData = ref(cloneDeep(defaultFormData));

/**
 * 是否已经加载全部数据 即 taskList.length === taskTotal
 */
const isLoadComplete = computed(
  () => taskList.value.length === taskTotal.value,
);

// 卡片父容器的ref
const cardContainerRef = useTemplateRef('cardContainerRef');

/**
 * @param resetFields 是否清空查询参数
 */
async function reload(resetFields: boolean = false) {
  // 需要先滚动到顶部
  cardContainerRef.value?.scroll({ top: 0, behavior: 'auto' });

  page.value = 1;
  currentTask.value = undefined;
  taskTotal.value = 0;
  lastSelectId.value = '';

  if (resetFields) {
    formData.value = cloneDeep(defaultFormData);
  }

  loading.value = true;
  const resp = await pageByTaskWait({
    pageSize: 10,
    pageNum: page.value,
    ...formData.value,
  });
  taskList.value = resp.rows.map((item) => ({ ...item, active: false }));
  taskTotal.value = resp.total;

  loading.value = false;
  // 默认选中第一个
  if (taskList.value.length > 0) {
    const firstTask = taskList.value[0]!;
    currentTask.value = firstTask;
    handleCardClick(firstTask);
  }
}

onMounted(reload);

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
    loading.value = true;
    page.value += 1;
    const resp = await pageByTaskWait({
      pageSize: 10,
      pageNum: page.value,
      ...formData.value,
    });
    taskList.value.push(
      ...resp.rows.map((item) => ({ ...item, active: false })),
    );
    loading.value = false;
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
        class="bg-background relative flex h-full min-w-[320px] max-w-[320px] flex-col rounded-lg"
      >
        <!-- 搜索条件 -->
        <div
          class="bg-background z-100 sticky left-0 top-0 w-full rounded-t-lg border-b-[1px] border-solid p-2"
        >
          <div class="flex items-center gap-1">
            <InputSearch
              v-model:value="formData.flowName"
              placeholder="流程名称搜索"
              @search="reload(false)"
            />
            <a-button @click="reload(true)">
              <RedoOutlined />
            </a-button>
            <Popover placement="rightTop" title="搜索" trigger="click">
              <template #content>
                <Form>
                  <FormItem label="任务名称">
                    <Input
                      v-model:value="formData.nodeName"
                      placeholder="请输入"
                    />
                  </FormItem>
                  <FormItem label="流程编码">
                    <Input
                      v-model:value="formData.flowCode"
                      placeholder="请输入"
                    />
                  </FormItem>
                  <FormItem>
                    <a-button type="primary" @click="reload(false)">
                      搜索
                    </a-button>
                    <a-button class="ml-2" @click="reload(true)">重置</a-button>
                  </FormItem>
                </Form>
              </template>
              <a-button>
                <FilterOutlined />
              </a-button>
            </Popover>
          </div>
        </div>
        <div
          ref="cardContainerRef"
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
          <!-- 遮罩loading层 -->
          <div
            v-if="loading"
            class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.1)]"
          >
            <Spin tip="加载中..." />
          </div>
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
      <ApprovalPanel :task="currentTask" type="approve" @reload="refreshTab" />
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
