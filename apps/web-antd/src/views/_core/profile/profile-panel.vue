<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsItem,
  Tag,
} from 'ant-design-vue';

defineProps<{ profile?: UserProfile }>();
</script>

<template>
  <Card :loading="!profile" class="h-full lg:w-1/3">
    <div v-if="profile" class="flex flex-col items-center gap-[24px]">
      <div class="flex flex-col items-center gap-[20px]">
        <Avatar :size="96" :src="profile.user.avatar" />
        <div class="flex flex-col items-center gap-[8px]">
          <span class="text-foreground text-xl font-bold">
            {{ profile.user.nickName ?? '未知' }}
          </span>
          <span> 海纳百川，有容乃大 </span>
        </div>
      </div>
      <div class="px-[24px]">
        <Descriptions :column="1">
          <DescriptionsItem label="账号">
            {{ profile.user.userName }}
          </DescriptionsItem>
          <DescriptionsItem label="手机号码">
            {{ profile.user.phonenumber ?? '未绑定手机号' }}
          </DescriptionsItem>
          <DescriptionsItem label="邮箱">
            {{ profile.user.email ?? '未绑定邮箱' }}
          </DescriptionsItem>
          <DescriptionsItem label="部门">
            <Tag color="processing">
              {{ profile.user.deptName ?? '未分配部门' }}
            </Tag>
            <Tag v-if="profile.postGroup" color="processing">
              {{ profile.postGroup }}
            </Tag>
          </DescriptionsItem>
          <DescriptionsItem label="上次登录">
            {{ profile.user.loginDate }}
          </DescriptionsItem>
        </Descriptions>
      </div>
    </div>
  </Card>
</template>
