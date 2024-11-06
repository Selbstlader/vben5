export { default as EmptyIcon } from './components/empty.vue';
export * from './create-icon';

export * from './lucide';

export type { IconifyIcon as IconifyIconStructure } from '@iconify/vue';
export { addCollection, addIcon, Icon as IconifyIcon } from '@iconify/vue';
// 离线图标使用
export {
  addCollection as addOfflineCollection,
  addIcon as addOfflineIcon,
  Icon as IconifyOfflineIcon,
} from '@iconify/vue/dist/offline';
