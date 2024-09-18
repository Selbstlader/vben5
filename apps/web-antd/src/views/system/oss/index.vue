<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

const router = useRouter();
</script>

<template>
  <Page>
    <a-button @click="() => router.push('/system/oss-config')">配置</a-button>
  </Page>
</template>
