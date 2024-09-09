<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  Tag as ATag,
  Button,
  Card,
  RadioButton,
  RadioGroup,
  Select,
  Space,
} from 'ant-design-vue';

import { DictTag } from '#/components/dict';
import { getDict, getDictOptions } from '#/utils/dict';

import DrawerDemo from './drawer.vue';
import ModalDemo from './modal.vue';
import TableTest from './table';

const count = ref(0);
let intervalId: null | ReturnType<typeof setInterval> = null;

onMounted(() => {
  intervalId = setInterval(() => {
    count.value++;
  }, 1000);
});

onBeforeUnmount(() => intervalId && clearInterval(intervalId));

const sexOptions = getDictOptions('sys_user_sex');
const disabledDict = getDict('sys_normal_disable');
const select = ref('pc');
const deviceOptions = getDictOptions('sys_device_type');

const [TestNodal, modalApi] = useVbenModal({
  connectedComponent: ModalDemo,
});

const [TestDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: DrawerDemo,
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
        <div class="flex gap-[6px]">
          <DictTag :dicts="disabledDict" value="0" />
          <DictTag :dicts="disabledDict" value="1" />
        </div>
        <RadioGroup v-model:value="select" button-style="solid">
          <RadioButton
            v-for="item in deviceOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </RadioButton>
        </RadioGroup>
      </div>
    </Card>
    <Card title="tag测试">
      <ATag :bordered="false" color="processing">processing</ATag>
      <ATag :bordered="false" color="success">success</ATag>
      <ATag :bordered="false" color="error">error</ATag>
      <ATag :bordered="false" color="warning">warning</ATag>
      <ATag :bordered="false" color="magenta">magenta</ATag>
      <ATag :bordered="false" color="red">red</ATag>
      <ATag :bordered="false" color="volcano">volcano</ATag>
      <ATag :bordered="false" color="orange">orange</ATag>
      <ATag :bordered="false" color="gold">gold</ATag>
      <ATag :bordered="false" color="lime">lime</ATag>
      <ATag :bordered="false" color="green">green</ATag>
      <ATag :bordered="false" color="cyan">cyan</ATag>
      <ATag :bordered="false" color="blue">blue</ATag>
      <ATag :bordered="false" color="geekblue">geekblue</ATag>
      <ATag :bordered="false" color="purple">purple</ATag>
    </Card>
    <Card title="table测试">
      <TableTest />
    </Card>
    <Card title="Modal/Drawer测试">
      <Space>
        <a-button @click="() => modalApi.open()">打开Modal</a-button>
        <a-button @click="() => drawerApi.open()">打开Drawer</a-button>
      </Space>
      <TestNodal />
      <TestDrawer />
    </Card>
  </div>
</template>
