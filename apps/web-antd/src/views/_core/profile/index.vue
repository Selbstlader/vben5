<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

const currentActiveKey = ref('tab1');

const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];
</script>

<template>
  <Page>
    <Card
      :active-tab-key="currentActiveKey"
      :tab-list="tabList"
      @tab-change="
        (key) => {
          currentActiveKey = key;
        }
      "
    >
      dsadsa
    </Card>
  </Page>
</template>
