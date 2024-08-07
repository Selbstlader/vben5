<script setup lang="ts">
import { onMounted } from 'vue';

import { Button } from 'ant-design-vue';

onMounted(() => {
  console.log('keepAlive测试 -> 挂载了');
});
</script>

<template>
  <div class="m-[8px]">
    <Button type="primary" v-access:code="['system:user:list']">
      测试按钮可见
    </Button>
  </div>
</template>
