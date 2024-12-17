<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useAppConfig } from '@vben/hooks';
import { stringify } from '@vben/request';
import { useAccessStore } from '@vben/stores';

defineOptions({ name: 'FlowDesigner' });

const route = useRoute();
const definitionId = route.query.definitionId as string;
const disabled = route.query.disabled === 'true';

const { clientId } = useAppConfig(import.meta.env, import.meta.env.PROD);

const accessStore = useAccessStore();
const params = {
  Authorization: `Bearer ${accessStore.accessToken}`,
  id: definitionId,
  clientId,
  disabled,
};

const url = `${import.meta.env.VITE_GLOB_API_URL}/warm-flow-ui/index.html?${stringify(params)}`;
</script>

<template>
  <iframe :src="url" class="size-full"></iframe>
</template>
