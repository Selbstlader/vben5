<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { Form, FormItem, Input, RadioGroup } from 'ant-design-vue';

import { userProfileUpdate } from '#/api/system/profile';
import { useAuthStore } from '#/store';
import { getDictOptions } from '#/utils/dict';

const props = defineProps<{ profile: UserProfile }>();

const emit = defineEmits<{ reload: [] }>();

/**
 * 要重构
 */
const form = ref({
  email: props.profile.user.email,
  nickName: props.profile.user.nickName,
  phonenumber: props.profile.user.phonenumber,
  sex: props.profile.user.sex,
  userId: props.profile.user.userId,
});

const sexOptions = getDictOptions('sys_user_sex');

const userStore = useUserStore();
const authStore = useAuthStore();

const loading = ref(false);
async function handleSubmit() {
  try {
    loading.value = true;
    await userProfileUpdate(form.value);
    // 更新store
    const userInfo = await authStore.fetchUserInfo();
    userStore.setUserInfo(userInfo);
    // 左边reload
    emit('reload');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mt-[16px] md:w-full lg:w-1/2 2xl:w-2/5">
    <Form :label-col="{ span: 4 }" :model="form" @finish="handleSubmit">
      <FormItem
        :rules="[{ required: true, message: '请输入昵称' }]"
        label="昵称"
        name="nickName"
      >
        <Input v-model:value="form.nickName" placeholder="请输入" />
      </FormItem>
      <FormItem
        :rules="[
          {
            required: true,
            message: '请输入正确的邮箱',
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          },
        ]"
        label="邮箱"
        name="email"
      >
        <Input v-model:value="form.email" placeholder="请输入" />
      </FormItem>
      <FormItem label="性别" name="sex">
        <RadioGroup
          v-model:value="form.sex"
          :options="sexOptions"
          button-style="solid"
          option-type="button"
        />
      </FormItem>
      <FormItem
        :rules="[
          {
            required: true,
            message: '请输入正确的电话',
            pattern: /^1[3-9]\d{9}$/,
          },
        ]"
        label="电话"
        name="phonenumber"
      >
        <Input v-model:value="form.phonenumber" placeholder="请输入" />
      </FormItem>
      <FormItem :wrapper-col="{ span: 4, offset: 4 }">
        <a-button :loading="loading" html-type="submit" type="primary">
          更新信息
        </a-button>
      </FormItem>
    </Form>
  </div>
</template>
