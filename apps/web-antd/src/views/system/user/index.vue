<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { Button, Card } from 'ant-design-vue';

onMounted(() => {
  console.log('keepAlive测试 -> 挂载了');
});

const count = ref(0);
let intervalId: number = 0;

onMounted(() => {
  intervalId = setInterval(() => {
    count.value++;
  }, 1000);
});

onBeforeUnmount(() => intervalId && clearInterval(intervalId));
</script>

<template>
  <div class="m-[8px]">
    <Card title="测试keepAlive">
      <template #extra>
        <Button type="primary" v-access:code="['system:user:list']">
          测试按钮权限system:user:list
        </Button>
      </template>
      <p>当前计数: {{ count }}</p>
    </Card>
  </div>
</template>
