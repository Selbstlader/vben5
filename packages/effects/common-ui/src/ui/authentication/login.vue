<script setup lang="ts">
import type { AuthenticationProps, LoginEmits } from './types';

import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  VbenButton,
  VbenCheckbox,
  VbenInput,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';
import ThirdPartyLogin from './third-party-login.vue';

interface Props extends AuthenticationProps {
  /**
   * @zh_CN 验证码图片base64
   */
  captchaBase64?: string;
  /**
   * 租户信息options
   */
  tenantOptions?: { companyName: string; domain?: string; tenantId: string }[];
  /**
   * @zh_CN 是否启用验证码
   */
  useCaptcha?: boolean;
  /**
   * @zh_CN 是否启用租户
   */
  useTenant?: boolean;
}

defineOptions({
  name: 'AuthenticationLogin',
});

const props = withDefaults(defineProps<Props>(), {
  captchaBase64: '',
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  loading: false,
  passwordPlaceholder: '',
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showRememberMe: true,
  showThirdPartyLogin: true,
  subTitle: '',
  tenantOptions: () => [],
  title: '',
  usernamePlaceholder: '',
});

const emit = defineEmits<{
  /**
   * 验证码点击
   */
  captchaClick: [];
  /**
   * 第三方登录 platfrom 对应平台的string
   */
  oauthLogin: [plateform: string];
  submit: LoginEmits['submit'];
}>();

const router = useRouter();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || 'admin';

const formState = reactive({
  code: '',
  password: 'admin123',
  rememberMe: !!localUsername,
  submitted: false,
  // 默认租户
  tenantId: '000000',
  username: localUsername,
});

/**
 * oauth登录 需要tenantId参数
 */
watch(
  () => formState.tenantId,
  (tenantId) => {
    localStorage.setItem('__oauth_tenant_id', tenantId);
  },
  {
    immediate: true,
  },
);

/**
 * 默认选中第一项租户
 */
const stop = watch(props.tenantOptions, (options) => {
  if (options.length > 0) {
    formState.tenantId = options[0]!.tenantId;
    stop();
  }
});

const usernameStatus = computed(() => {
  return formState.submitted && !formState.username ? 'error' : 'default';
});

const passwordStatus = computed(() => {
  return formState.submitted && !formState.password ? 'error' : 'default';
});

const captchaStatus = computed(() => {
  return formState.submitted && !formState.code ? 'error' : 'default';
});

function handleSubmit() {
  formState.submitted = true;

  if (
    usernameStatus.value !== 'default' ||
    passwordStatus.value !== 'default'
  ) {
    return;
  }

  // 验证码
  if (props.useCaptcha && captchaStatus.value !== 'default') {
    return;
  }

  localStorage.setItem(
    REMEMBER_ME_KEY,
    formState.rememberMe ? formState.username : '',
  );

  emit('submit', {
    code: formState.code,
    grantType: 'password',
    password: formState.password,
    tenantId: formState.tenantId,
    username: formState.username,
  });
}

function handleGo(path: string) {
  router.push(path);
}

/**
 * 重置验证码
 */
function resetCaptcha() {
  emit('captchaClick');
  formState.code = '';
  // todo 获取焦点
  // VbenInput并没有提供focus方法
}

defineExpose({ resetCaptcha });
</script>

<template>
  <div @keydown.enter.prevent="handleSubmit">
    <slot name="title">
      <Title>
        {{ title || `${$t('authentication.welcomeBack')} 👋🏻` }}
        <template #desc>
          <span class="text-muted-foreground">
            {{ subTitle || $t('authentication.loginSubtitle') }}
          </span>
        </template>
      </Title>
    </slot>

    <!-- 租户 -->
    <div v-if="useTenant" class="tenant-picker mb-6">
      <Select v-model="formState.tenantId">
        <SelectTrigger>
          <SelectValue placeholder="选择公司" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="item in tenantOptions"
              :key="item.tenantId"
              :value="item.tenantId"
            >
              {{ item.companyName }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <VbenInput
      v-model="formState.username"
      :autofocus="false"
      :error-tip="$t('authentication.usernameTip')"
      :label="$t('authentication.username')"
      :placeholder="usernamePlaceholder || $t('authentication.username')"
      :status="usernameStatus"
      name="username"
      required
      type="text"
    />
    <VbenInputPassword
      v-model="formState.password"
      :error-tip="$t('authentication.passwordTip')"
      :label="$t('authentication.password')"
      :placeholder="passwordPlaceholder || $t('authentication.password')"
      :status="passwordStatus"
      name="password"
      required
      type="password"
    />

    <!-- 图片验证码 -->
    <div v-if="useCaptcha" class="flex">
      <div class="flex-1">
        <VbenInput
          v-model="formState.code"
          :error-tip="$t('authentication.captchaTip')"
          :label="$t('authentication.captcha')"
          :placeholder="$t('authentication.captcha')"
          :status="captchaStatus"
          name="code"
          required
          type="text"
        />
      </div>
      <img
        :src="captchaBase64"
        class="h-[40px] w-[115px] rounded-r-md"
        @click="emit('captchaClick')"
      />
    </div>

    <div
      v-if="showRememberMe || showForgetPassword"
      class="mb-6 mt-4 flex justify-between"
    >
      <div class="flex-center">
        <VbenCheckbox v-model:checked="formState.rememberMe" name="rememberMe">
          {{ $t('authentication.rememberMe') }}
        </VbenCheckbox>
      </div>

      <span
        v-if="showForgetPassword"
        class="text-primary hover:text-primary-hover active:text-primary-active cursor-pointer text-sm font-normal"
        @click="handleGo(forgetPasswordPath)"
      >
        {{ $t('authentication.forgetPassword') }}
      </span>
    </div>
    <VbenButton :loading="loading" class="w-full" @click="handleSubmit">
      {{ $t('common.login') }}
    </VbenButton>

    <div
      v-if="showCodeLogin || showQrcodeLogin"
      class="mb-2 mt-4 flex items-center justify-between"
    >
      <VbenButton
        v-if="showCodeLogin"
        class="w-1/2"
        variant="outline"
        @click="handleGo(codeLoginPath)"
      >
        {{ $t('authentication.mobileLogin') }}
      </VbenButton>
      <VbenButton
        v-if="showQrcodeLogin"
        class="ml-4 w-1/2"
        variant="outline"
        @click="handleGo(qrCodeLoginPath)"
      >
        {{ $t('authentication.qrcodeLogin') }}
      </VbenButton>
    </div>

    <!-- 第三方登录 -->
    <slot name="third-party-login">
      <ThirdPartyLogin
        v-if="showThirdPartyLogin"
        @oauth-login="(e) => emit('oauthLogin', e)"
      />
    </slot>

    <slot name="to-register">
      <div v-if="showRegister" class="mt-3 text-center text-sm">
        {{ $t('authentication.accountTip') }}
        <span
          class="text-primary hover:text-primary-hover active:text-primary-active cursor-pointer text-sm font-normal"
          @click="handleGo(registerPath)"
        >
          {{ $t('authentication.createAccount') }}
        </span>
      </div>
    </slot>
  </div>
</template>

<style lang="scss">
/**
  tenant-picker 跟下面的输入框样式保持一致
*/
.tenant-picker > button[role='combobox'] {
  height: 40px;
  background-color: hsl(var(--input-background));

  &:focus {
    @apply border-primary;
  }
}

/**
  验证码输入框样式
  去除右边的圆角
*/
input[id='code'] {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
