<script setup lang="ts">
import { Avatar, Descriptions, DescriptionsItem, Tag } from 'ant-design-vue';

interface Props {
  endTime: string;
  startTime: string;
  title: string;
  desc: string;
  status: string;
}

withDefaults(defineProps<{ info: Props }>(), {});
</script>

<template>
  <div
    class="cursor-pointer rounded-lg border-[1px] border-solid border-gray-200 p-3 transition-shadow duration-300 ease-in-out hover:shadow-lg"
  >
    <Descriptions :column="1" :title="info.title" size="middle">
      <template #extra>
        <Tag color="warning">审批中</Tag>
      </template>
      <DescriptionsItem label="描述">{{ info.desc }}</DescriptionsItem>
      <DescriptionsItem label="开始时间">{{ info.startTime }}</DescriptionsItem>
      <DescriptionsItem label="结束时间">{{ info.endTime }}</DescriptionsItem>
    </Descriptions>
    <div class="flex items-center justify-between text-[14px]">
      <div class="flex items-center gap-1">
        <Avatar
          size="small"
          src="https://plus.dapdap.top/minio-server/plus/2024/11/21/925ed278e2d441beb7f695b41e13c4dd.jpg"
        />
        <span class="opacity-50">疯狂的牛子Li</span>
      </div>
      <div class="opacity-50">处理时间: 2022-01-01</div>
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
