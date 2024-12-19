<!--抄送组件-->
<script setup lang="ts">
import type { User } from '#/api/system/user/model';

import type { PropType } from 'vue';

import { useVbenModal, VbenAvatar } from '@vben/common-ui';

import { AvatarGroup, Tooltip } from 'ant-design-vue';

import { userSelectModal } from '.';

defineOptions({
  name: 'CopyComponent',
  inheritAttrs: false,
});

const emit = defineEmits<{ finish: [User[]] }>();

const [UserSelectModal, modalApi] = useVbenModal({
  connectedComponent: userSelectModal,
});

const userListModel = defineModel('userList', {
  type: Array as PropType<User[]>,
  default: () => [],
});

function handleOpen() {
  modalApi.setData({ userList: userListModel.value });
  modalApi.open();
}

function handleFinish(userList: User[]) {
  // 清空 直接赋值[]会丢失响应性
  userListModel.value.splice(0, userListModel.value.length);
  userListModel.value.push(...userList);
  emit('finish', userList);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <AvatarGroup v-if="userListModel.length > 0" class="flex-wrap">
      <Tooltip
        v-for="user in userListModel"
        :key="user.userId"
        :title="user.nickName"
        placement="top"
      >
        <div>
          <VbenAvatar
            :alt="user.nickName"
            class="bg-primary size-[36px] rounded-full border text-white"
            src=""
          />
        </div>
      </Tooltip>
    </AvatarGroup>
    <a-button size="small" @click="handleOpen">选择人员</a-button>
    <UserSelectModal @finish="handleFinish" />
  </div>
</template>
