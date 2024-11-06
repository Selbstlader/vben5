import { defineComponent, h } from 'vue';

import { Icon, type IconifyIcon } from '@iconify/vue';
import {
  addIcon as addOfflineIcon,
  Icon as OfflineIcon,
} from '@iconify/vue/dist/offline';

function createIconifyIcon(icon: string) {
  return defineComponent({
    name: `Icon-${icon}`,
    setup(props, { attrs }) {
      return () => h(Icon, { icon, ...props, ...attrs });
    },
  });
}

/**
 * 创建离线图标
 * @param icon 图标名称 建议与iconify的名称保持一致
 * @param iconComponent 从@iconify/icon-xxx/xxx导入的图标
 * @returns IconComponent
 */
function createIconifyOfflineIcon(icon: string, iconComponent: IconifyIcon) {
  return defineComponent({
    name: `Icon-${icon}`,
    setup(props, { attrs }) {
      addOfflineIcon(icon, iconComponent);
      return () => h(OfflineIcon, { icon, ...props, ...attrs });
    },
  });
}

export { createIconifyIcon, createIconifyOfflineIcon };
