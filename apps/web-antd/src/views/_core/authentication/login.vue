<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { AuthenticationLogin } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { omit } from 'lodash-es';

import { tenantList, type TenantResp } from '#/api';
import { captchaImage, type CaptchaResponse } from '#/api/core/captcha';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaInfo = ref<CaptchaResponse>({
  captchaEnabled: false,
  img: '',
  uuid: '',
});

async function loadCaptcha() {
  const resp = await captchaImage();
  if (resp.captchaEnabled) {
    resp.img = `data:image/png;base64,${resp.img}`;
  }
  captchaInfo.value = resp;
}

const tenantInfo = ref<TenantResp>({
  tenantEnabled: false,
  voList: [],
});

async function loadTenant() {
  const resp = await tenantList();
  tenantInfo.value = resp;
}

onMounted(() => {
  loadCaptcha();
  loadTenant();
});

interface LoginForm {
  code?: string;
  grantType: string;
  password: string;
  tenantId: string;
  username: string;
}

const loginRef = ref<InstanceType<typeof AuthenticationLogin>>();
async function handleAccountLogin(values: LoginForm) {
  try {
    const requestParam: any = omit(values, ['code']);
    // 验证码
    if (captchaInfo.value.captchaEnabled) {
      requestParam.code = values.code;
      requestParam.uuid = captchaInfo.value.uuid;
    }
    // 登录
    await authStore.authLogin(requestParam);
  } catch (error) {
    console.error(error);
    // 处理验证码错误
    if (error instanceof Error) {
      const message = error.message;
      if (message.includes('captcha') || message.includes('验证码')) {
        // 刷新验证码
        loginRef.value?.resetCaptcha();
      }
    }
  }
}

function handleOauthLogin(provider: string) {
  switch (provider) {
    case 'gitee': {
      message.success('todo gitee login');
      break;
    }
    default: {
      message.warn('暂不支持该登录方式');
    }
  }
}
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :captcha-base64="captchaInfo.img"
    :loading="authStore.loginLoading"
    :show-register="false"
    :tenant-options="tenantInfo.voList"
    :use-captcha="captchaInfo.captchaEnabled"
    :use-tenant="tenantInfo.tenantEnabled"
    password-placeholder="密码"
    username-placeholder="用户名"
    @captcha-click="loadCaptcha"
    @oauth-login="handleOauthLogin"
    @submit="handleAccountLogin"
  />
</template>
