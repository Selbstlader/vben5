<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { Button, Card, Select } from 'ant-design-vue';

import { DictTag } from '#/components/Dict';
import { useDictStore } from '#/store/dict';
import { getDict, getDictOptions } from '#/utils/dict';

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

const sexOptions = getDictOptions('sys_user_sex');
const disabledDict = getDict('sys_normal_disable');

const dictStore = useDictStore();
onMounted(() => {
  console.log(dictStore.dictMap);
  console.log(dictStore.dictOptionsMap);
});
</script>

<template>
  <div class="m-[16px] flex flex-col gap-[16px]">
    <Card title="测试keepAlive">
      <template #extra>
        <Button type="primary" v-access:code="['system:user:list']">
          测试按钮权限system:user:list
        </Button>
      </template>
      <p>当前计数: {{ count }}</p>
    </Card>
    <Card title="字典测试">
      <div class="flex items-center gap-[16px]">
        <Select
          :options="sexOptions"
          class="w-[200px]"
          placeholder="请选择性别"
        />
        <DictTag :dicts="disabledDict" value="0" />
        <DictTag :dicts="disabledDict" value="1" />
      </div>
    </Card>
  </div>
</template>
