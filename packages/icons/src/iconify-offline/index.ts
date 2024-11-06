import { createIconifyOfflineIcon } from '@vben-core/icons';

import githubOutlined from '@iconify/icons-ant-design/github-outlined';
import inboxIcon from '@iconify/icons-ant-design/inbox-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
import comandLine from '@iconify/icons-flat-color-icons/command-line';
import memoryIcon from '@iconify/icons-la/memory';
import redisIcon from '@iconify/icons-logos/redis';
import excelIcon from '@iconify/icons-vscode-icons/file-type-excel';

// 用户 下拉菜单
export const GitHubOutlined = createIconifyOfflineIcon(
  'ant-design:github-outlined',
  githubOutlined,
);

export const UserOutlined = createIconifyOfflineIcon(
  'ant-design:user-outlined',
  userOutlined,
);

// 缓存监控使用
export const RedisIcon = createIconifyOfflineIcon('logos:redis', redisIcon);
export const CommandLineIcon = createIconifyOfflineIcon(
  'flat-color-icons:command-line',
  comandLine,
);
export const MemoryIcon = createIconifyOfflineIcon('la:memory', memoryIcon);

// 用户管理 导入
// Excel图标
export const ExcelIcon = createIconifyOfflineIcon(
  'vscode-icons:file-type-excel',
  excelIcon,
);
// 拖拽上传图标
export const InBoxIcon = createIconifyOfflineIcon(
  'ant-design:inbox-outlined',
  inboxIcon,
);
