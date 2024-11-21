<script setup lang="ts">
import { Page } from '@vben/common-ui';

import {
  Alert,
  Avatar,
  Card,
  Divider,
  Space,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { ApprovalCard } from '../components';
</script>

<template>
  <Page :auto-content-height="true">
    <div class="flex h-full gap-2">
      <div
        class="bg-background h-full w-[320px] overflow-y-auto rounded-lg py-3"
      >
        <div class="flex flex-col gap-2">
          <ApprovalCard
            v-for="item in 10"
            :key="item"
            :info="{
              startTime: '2022-01-01',
              endTime: '2022-01-02',
              title: '审批任务',
              desc: '审批任务描述',
              status: '审批中',
            }"
            class="mx-2"
          />
        </div>
      </div>
      <Card class="flex-1" size="small" title="编号: 1234567890123456789012">
        <div class="flex flex-col gap-5 p-4">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <div class="text-2xl font-bold">报销申请</div>
              <div>
                <Tag color="warning">申请中</Tag>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Avatar
                size="small"
                src="https://plus.dapdap.top/minio-server/plus/2024/11/21/925ed278e2d441beb7f695b41e13c4dd.jpg"
              />
              <span>疯狂的牛子Li</span>
              <div class="flex items-center opacity-50">
                <span>XXXX有限公司</span>
                <Divider type="vertical" />
                <span>提交于: 2022-01-01 12:00:00</span>
              </div>
            </div>
          </div>
          <Tabs>
            <TabPane key="1" tab="审批详情">
              <Alert message="该页面仅为静态页 后期可能会用到!" type="info" />
            </TabPane>
            <TabPane key="2" tab="审批记录">审批记录</TabPane>
            <TabPane key="3" tab="全文评论(999+)">全文评论</TabPane>
          </Tabs>
        </div>
        <!-- 固定底部 -->
        <div
          class="border-t-solid absolute bottom-0 left-0 w-full border-t-[1px] border-t-slate-300 p-3"
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
    </div>
  </Page>
</template>
