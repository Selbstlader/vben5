<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

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

onMounted(async () => {
  await loadCaptcha();
  await loadTenant();
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        class: 'tenant-picker',
        options: tenantInfo.value.voList.map((item) => ({
          label: item.companyName,
          value: item.tenantId,
        })),
        placeholder: $t('authentication.selectAccount'),
        valueprop: 'tenantId',
      },
      dependencies: {
        trigger(values, _form) {
          console.log(values);
        },
        triggerFields: [''],
      },
      fieldName: 'tenantId',
      label: $t('authentication.selectAccount'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.selectAccount') })
        .optional()
        .default('000000'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        class: 'login-input',
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        class: 'login-input',
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(6, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInputCaptcha',
      componentProps: {
        captcha: captchaInfo.value.img,
        class: 'login-input',
        onCaptchaClick: loadCaptcha,
        placeholder: $t('authentication.code'),
      },
      dependencies: {
        if: () => captchaInfo.value.captchaEnabled,
        triggerFields: [''],
      },
      fieldName: 'code',
      label: $t('authentication.code'),
      rules: z.string().min(1, { message: $t('authentication.codeTip') }),
    },
  ];
});

interface LoginForm {
  code?: string;
  grantType: string;
  password: string;
  tenantId: string;
  username: string;
}

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
      // 刷新验证码
      // todo
    }
  }
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleAccountLogin"
  />
</template>

<style lang="scss">
/**
  tenant-picker 跟下面的输入框样式保持一致
*/
.tenant-picker {
  height: 40px;
  background-color: hsl(var(--input-background));

  &:focus {
    @apply border-primary;
  }
}

.login-input {
  &:focus {
    @apply border-primary;
  }
}
</style>
