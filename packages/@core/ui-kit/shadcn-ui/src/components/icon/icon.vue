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
}>();

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon);
});

const isComponent = computed(() => {
  const { icon } = props;
  return !isString(icon) && (isObject(icon) || isFunction(icon));
});

/**
 * 判断图标是否为离线图标
 * 主要是判断后缀是否为 |offline
 */
const offlineIcon = computed(() => {
  if (
    isString(props.icon) &&
    !isHttpUrl(props.icon) &&
    props.icon.endsWith('|offline')
  ) {
    return {
      confirm: true,
      icon: props.icon.replace('|offline', ''),
    };
  }
  return {
    confirm: false,
    icon: '',
  };
});
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
  <IconifyOfflineIcon
    v-else-if="offlineIcon.confirm"
    v-bind="$attrs"
    :icon="offlineIcon.icon"
  />
  <IconifyIcon v-else-if="icon" v-bind="$attrs" :icon="icon as string" />
  <IconDefault v-else-if="fallback" v-bind="$attrs" />
</template>
