<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { userProfile } from '#/api/system/profile';

import ProfilePanel from './profile-panel.vue';
import SettingPanel from './setting-panel.vue';

const profile = ref<UserProfile>();
async function loadProfile() {
  const resp = await userProfile();
  profile.value = resp;
}

onMounted(loadProfile);
</script>

<template>
  <Page>
    <div class="flex flex-col gap-[16px] lg:flex-row">
      <!-- 左侧 -->
      <ProfilePanel :profile="profile" @upload-finish="loadProfile" />
      <!-- 右侧 -->
      <SettingPanel v-if="profile" :profile="profile" @reload="loadProfile" />
    </div>
  </Page>
</template>
