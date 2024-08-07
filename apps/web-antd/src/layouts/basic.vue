<script lang="ts" setup>
import { computed, onMounted } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { BookOpenText, CircleHelp, MdiGithub } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { storeToRefs, useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { message } from 'ant-design-vue';

import TenantToggle from '#/components/TenantToggle/index.vue';
import { $t } from '#/locales';
import { resetRoutes } from '#/router';
import { useAuthStore, useNotifyStore } from '#/store';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();

const menus = computed(() => [
  {
    handler: () => {
      openWindow(VBEN_DOC_URL, {
        target: '_blank',
      });
    },
    icon: BookOpenText,
    text: $t('widgets.document'),
  },
  {
    handler: () => {
      openWindow(VBEN_GITHUB_URL, {
        target: '_blank',
      });
    },
    icon: MdiGithub,
    text: 'GitHub',
  },
  {
    handler: () => {
      openWindow(`${VBEN_GITHUB_URL}/issues`, {
        target: '_blank',
      });
    },
    icon: CircleHelp,
    text: $t('widgets.qa'),
  },
]);

const { loginLoading } = storeToRefs(authStore);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  // resetAllStores();
  resetRoutes();
  // await router.replace(LOGIN_PATH);
  authStore.logout();
}

const notifyStore = useNotifyStore();
onMounted(() => notifyStore.startListeningMessage());

function handleViewAll() {
  message.warning('暂未开放');
}
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #header-right-1>
      <TenantToggle />
    </template>
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.realName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="notifyStore.showDot"
        :notifications="notifyStore.notifications"
        @clear="notifyStore.clearAllMessage"
        @make-all="notifyStore.setAllRead"
        @read="notifyStore.setRead"
        @view-all="handleViewAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
        :loading="loginLoading"
        password-placeholder="123456"
        username-placeholder="vben"
        @submit="authStore.authLogin"
      />
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
