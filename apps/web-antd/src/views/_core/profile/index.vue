<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsItem,
  Tag,
} from 'ant-design-vue';

import { userProfile } from '#/api/system/profile';

const currentActiveKey = ref('tab1');

const tabList = [
  {
    key: 'tab1',
    tab: '基本设置',
  },
  {
    key: 'tab2',
    tab: '安全设置',
  },
  {
    key: 'tab3',
    tab: '账号绑定',
  },
];

const userStore = useUserStore();
const profile = ref<UserProfile>();
onMounted(async () => {
  console.log(userStore.userInfo);
  profile.value = await userProfile();
});
</script>

<template>
  <Page>
    <div class="flex flex-col gap-[16px] lg:flex-row">
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
      <Card
        :active-tab-key="currentActiveKey"
        :tab-list="tabList"
        class="lg:flex-1"
        @tab-change="
          (key) => {
            currentActiveKey = key;
          }
        "
      >
        <div
          class="flex h-[550px] items-center justify-center rounded-xl bg-[hsl(var(--primary))]"
        >
          <span class="text-lg font-bold text-white dark:text-black">
            基本设置
          </span>
        </div>
      </Card>
    </div>
  </Page>
</template>
