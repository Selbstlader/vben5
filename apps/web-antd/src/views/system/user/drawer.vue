<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    message.info('点击了确认');
  },
});
</script>

<template>
  <BasicDrawer
    class="w-[600px]"
    title="基础弹窗示例"
    title-tooltip="标题提示内容"
  >
    <div
      class="flex h-40 cursor-pointer items-center justify-center rounded-lg bg-pink-500 font-bold text-white transition-all hover:bg-blue-600 hover:text-[20px]"
    >
      this is Drawer content
    </div>
  </BasicDrawer>
</template>
