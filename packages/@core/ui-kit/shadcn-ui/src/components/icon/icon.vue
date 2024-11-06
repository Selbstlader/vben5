<script setup lang="ts">
import { type Component, computed } from 'vue';

import { IconDefault, IconifyIcon, IconifyOfflineIcon } from '@vben-core/icons';
import {
  isFunction,
  isHttpUrl,
  isObject,
  isString,
} from '@vben-core/shared/utils';

const props = defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean;
  icon?: Component | Function | string;
  offline?: boolean;
}>();

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon);
});

const isComponent = computed(() => {
  const { icon } = props;
  return !isString(icon) && (isObject(icon) || isFunction(icon));
});
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
  <IconifyOfflineIcon
    v-else-if="icon && offline"
    v-bind="$attrs"
    :icon="icon as string"
  />
  <IconifyIcon
    v-else-if="icon && !offline"
    v-bind="$attrs"
    :icon="icon as string"
  />
  <IconDefault v-else-if="fallback" v-bind="$attrs" />
</template>
