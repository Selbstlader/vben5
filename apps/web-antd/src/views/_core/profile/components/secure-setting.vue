<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';

import { ref } from 'vue';

import { Form, FormItem, InputPassword, Modal } from 'ant-design-vue';
import { omit } from 'lodash-es';

import { userUpdatePassword } from '#/api/system/profile';
import { useAuthStore } from '#/store';

const form = ref({
  confirmPassword: '',
  newPassword: '',
  oldPassword: '',
});

const newPassRules: RuleObject[] = [
  {
    required: true,
    validator: (_, value) => {
      if (!value) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('新密码不能为空');
      }
      if (value === form.value.oldPassword) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('新旧密码不能相同');
      }
      return Promise.resolve();
    },
  },
];

const confirmRules: RuleObject[] = [
  {
    required: true,
    validator: (_, value) => {
      if (!value) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('确认密码不能为空');
      }
      if (value !== form.value.newPassword) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('两次输入的密码不一致!');
      }
      return Promise.resolve();
    },
  },
];

const authStore = useAuthStore();

const loading = ref(false);
function handleSubmit() {
  Modal.confirm({
    content: '确认修改密码吗？',
    onOk: async () => {
      loading.value = true;
      try {
        await userUpdatePassword(omit(form.value, ['confirmPassword']));
        await authStore.logout(true);
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    },
    title: '提示',
  });
}
</script>

<template>
  <div class="mt-[16px] md:w-full lg:w-1/2 xl:w-1/3">
    <Form :label-col="{ span: 5 }" :model="form" @finish="handleSubmit">
      <FormItem
        :rules="[{ required: true, message: '请输入旧密码' }]"
        label="旧密码"
        name="oldPassword"
      >
        <InputPassword
          v-model:value="form.oldPassword"
          allow-clear
          placeholder="请输入"
        />
      </FormItem>
      <FormItem :rules="newPassRules" label="新密码" name="newPassword">
        <InputPassword
          v-model:value="form.newPassword"
          allow-clear
          placeholder="请输入"
        />
      </FormItem>
      <FormItem :rules="confirmRules" label="确认密码" name="confirmPassword">
        <InputPassword
          v-model:value="form.confirmPassword"
          allow-clear
          placeholder="请输入"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 5, offset: 5 }">
        <a-button :loading="loading" html-type="submit" type="primary">
          修改密码
        </a-button>
      </FormItem>
    </Form>
  </div>
</template>
