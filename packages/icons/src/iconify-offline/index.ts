import { createIconifyOfflineIcon } from '@vben-core/icons';

import githubOutlined from '@iconify/icons-ant-design/github-outlined';
import inboxIcon from '@iconify/icons-ant-design/inbox-outlined';
import userOutlined from '@iconify/icons-ant-design/user-outlined';
import alipayIcon from '@iconify/icons-fa-brands/alipay';
import comandLine from '@iconify/icons-flat-color-icons/command-line';
import memoryIcon from '@iconify/icons-la/memory';
import redisIcon from '@iconify/icons-logos/redis';
import dingdingFill from '@iconify/icons-ri/dingding-fill';
import taobaoIconFill from '@iconify/icons-ri/taobao-fill';
import giteeIcon from '@iconify/icons-simple-icons/gitee';
import githubOAuthIcon from '@iconify/icons-uiw/github';
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

// 第三方登录相关图标
export const TaobaoIcon = createIconifyOfflineIcon(
  'ri:taobao-fill',
  taobaoIconFill,
);
export const AlipayIcon = createIconifyOfflineIcon(
  'fa-brands:alipay',
  alipayIcon,
);
export const DingdingIcon = createIconifyOfflineIcon(
  'ri:dingding-fill',
  dingdingFill,
);
export const GiteeIcon = createIconifyOfflineIcon(
  'simple-icons:gitee',
  giteeIcon,
);
export const GithubOAuthIcon = createIconifyOfflineIcon(
  'uiw:github',
  githubOAuthIcon,
);
