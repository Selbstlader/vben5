# RuoYi-Plus-Vben5二次开发指南

## 项目概述

RuoYi-Plus-Vben5是一个基于Vue 3和Vben Admin框架的前端项目，对接了RuoYi-Vue-Plus后台管理系统。项目采用了现代化的前端技术栈，包括Vue 3.5.13、Ant Design Vue 4.2.6和Vben Admin 5.5.4等，为企业级应用提供了完整的前端解决方案。

### 技术栈

- **Vue 3.5.13**: 渐进式JavaScript框架
- **TypeScript**: 类型化的JavaScript超集
- **Ant Design Vue 4.2.6**: 基于Ant Design的Vue组件库
- **Vben Admin 5.5.4**: 开箱即用的中后台管理系统
- **Vite**: 现代化的前端构建工具
- **Pinia**: Vue的状态管理库
- **Vue Router**: Vue的官方路由
- **Monorepo**: 基于pnpm workspace的多包管理方式

## 环境准备

### 系统要求

- **Node.js**: >=20.15.0
- **pnpm**: 最新版本
- **Git**: 最新版本
- **编辑器**: 推荐VSCode

### 开发环境设置

1. **克隆项目**:

   ```bash
   git clone https://gitee.com/dapppp/ruoyi-plus-vben5.git
   cd ruoyi-plus-vben5
   ```

2. **安装依赖**:

   ```bash
   pnpm install
   ```

3. **启动开发服务器**:
   ```bash
   pnpm dev:antd
   ```

## 项目结构

```
ruoyi-plus-vben5/
├── apps/                    # 应用目录
│   ├── web-antd/            # 主应用（业务开发主要在这里进行）
│   │   ├── src/
│   │   │   ├── api/         # API接口定义，按业务模块组织
│   │   │   │   ├── system/  # 系统管理相关API
│   │   │   │   ├── monitor/ # 系统监控相关API
│   │   │   │   ├── workflow/# 工作流相关API
│   │   │   │   ├── tool/    # 系统工具相关API
│   │   │   │   └── ...
│   │   │   ├── components/  # 业务组件
│   │   │   ├── layouts/     # 布局组件
│   │   │   ├── router/      # 路由配置
│   │   │   ├── store/       # 状态管理
│   │   │   ├── utils/       # 工具函数
│   │   │   ├── views/       # 页面视图，按模块组织
│   │   │   │   ├── system/  # 系统管理页面
│   │   │   │   ├── monitor/ # 系统监控页面
│   │   │   │   ├── workflow/# 工作流页面
│   │   │   │   ├── dashboard/# 仪表盘页面
│   │   │   │   └── ...
│   │   │   ├── bootstrap.ts # 应用启动入口
│   │   │   ├── main.ts      # 主入口文件
│   │   │   └── app.vue      # 根组件
│   ├── backend-mock/        # 模拟后端服务（开发测试用）
│   │   ├── api/             # 模拟API接口
│   │   ├── routes/          # 路由定义
│   │   ├── utils/           # 工具函数
│   │   └── middleware/      # 中间件
├── packages/                # 共享包目录
│   ├── access/              # 权限控制模块
│   ├── common-ui/           # 通用UI组件
│   ├── constants/           # 常量定义
│   ├── hooks/               # Vue组合式函数
│   ├── icons/               # 图标库
│   ├── layouts/             # 布局组件
│   ├── locales/             # 国际化资源
│   ├── plugins/             # 插件
│   ├── preferences/         # 用户偏好设置
│   ├── request/             # 请求库
│   ├── stores/              # Pinia状态存储
│   ├── styles/              # 样式库
│   ├── types/               # 类型定义
│   └── utils/               # 工具函数
├── playground/              # 组件开发和测试环境
│   ├── src/                 # 测试环境源码
│   ├── __tests__/           # 端到端测试
│   └── ...
├── internal/                # 内部开发工具和配置
├── scripts/                 # 脚本文件
│   ├── preview/             # 预览图片
│   └── ...
├── docs/                    # 文档
├── .vscode/                 # VSCode配置
├── .github/                 # GitHub工作流配置
├── .gitee/                  # Gitee配置
├── .changeset/              # 变更集管理
├── vben-admin.code-workspace # VSCode工作区配置
├── package.json             # 项目依赖和脚本
├── pnpm-workspace.yaml      # PNPM工作区配置
├── turbo.json               # Turbo构建配置
└── ...
```

## 目录详细说明

### 应用目录 (apps/)

#### web-antd

主要业务应用，这是开发者进行业务开发的主要工作区域。

- **src/api/**: 按业务模块组织的API接口定义
  - **system/**: 系统管理模块API (用户、角色、部门等)
  - **monitor/**: 系统监控模块API (日志、性能等)
  - **workflow/**: 工作流相关API
  - **tool/**: 系统工具模块API
- **src/views/**: 页面视图目录，同样按业务模块组织
  - **system/**: 系统管理相关页面 (用户管理、角色管理、部门管理等)
  - **monitor/**: 系统监控页面 (登录日志、操作日志等)
  - **workflow/**: 工作流相关页面
  - **dashboard/**: 仪表盘/首页
  - **\_core/**: 核心框架相关页面 (登录、错误页等)
- **src/router/**: 路由配置，定义应用的页面路由和权限
- **src/store/**: 状态管理，使用Pinia进行全局状态管理
- **src/components/**: 业务相关的公共组件
- **src/utils/**: 项目中使用的工具函数
- **src/layouts/**: 页面布局组件
- **src/bootstrap.ts**: 应用启动逻辑
- **src/main.ts**: 应用入口文件
- **src/app.vue**: 根组件

#### backend-mock

模拟后端服务，用于前端开发时提供API模拟数据，避免依赖后端服务。

- **api/**: 模拟API接口实现
- **routes/**: 路由定义
- **utils/**: 工具函数，如响应格式化、模拟数据生成等
- **middleware/**: 中间件实现，如认证、日志等

### 共享包目录 (packages/)

这些包被设计为可复用的模块，实现了框架的核心功能，业务代码可以直接引用这些包。

- **access/**: 权限控制模块，实现了基于角色的权限控制系统
- **common-ui/**: 通用UI组件库，如表格、表单、弹窗等增强组件
- **constants/**: 全局常量定义
- **hooks/**: Vue组合式函数，提供了常用的功能钩子
- **icons/**: 图标库，包含系统使用的所有图标
- **layouts/**: 布局组件，如页面布局、菜单、头部等
- **locales/**: 国际化资源，管理多语言翻译
- **plugins/**: 插件集合，如错误处理、性能监控等
- **preferences/**: 用户偏好设置，管理主题、语言等个性化配置
- **request/**: HTTP请求库，对axios的封装，支持请求/响应拦截、缓存等
- **stores/**: Pinia状态存储，管理全局状态
- **styles/**: 全局样式库，包含主题变量、公共样式等
- **types/**: TypeScript类型定义
- **utils/**: 通用工具函数

### Playground (playground/)

组件和功能的开发测试环境，用于隔离测试组件和功能，不含具体业务逻辑。

- **src/**: 测试环境源码，包含基础视图和路由
- \***\*tests**/\*\*: 端到端测试用例
- **vite.config.mts**: Vite配置文件
- **playwright.config.ts**: 端到端测试配置

### 其他重要目录

- **internal/**: 内部开发工具和构建配置
- **scripts/**: 项目脚本文件，如构建、部署脚本等
- **docs/**: 项目文档
- **.vscode/**: VSCode编辑器配置
- **.github/**: GitHub CI/CD工作流配置
- **.gitee/**: Gitee配置和工作流
- **.changeset/**: 变更集管理，用于版本控制和发布日志生成
- **vben-admin.code-workspace**: VSCode工作区配置文件

### 配置文件

- **package.json**: 项目依赖和脚本命令定义
- **pnpm-workspace.yaml**: PNPM工作区配置，定义monorepo结构
- **turbo.json**: Turbo构建工具配置，优化构建性能
- **vite.config.mts**: Vite打包工具配置
- **.npmrc**: NPM配置文件
- **.gitignore**: Git忽略文件配置

## 二次开发指南

### 1. 了解目录结构

开发前，需要熟悉整个项目的结构。主要的开发工作将在`apps/web-antd`目录下进行：

- `src/views`: 页面视图
- `src/api`: API接口
- `src/components`: 业务组件
- `src/router`: 路由配置

### 2. 新增页面开发流程

#### 2.1 创建API接口

在`apps/web-antd/src/api`目录下，根据业务模块创建相应的API文件：

```typescript
// apps/web-antd/src/api/example/index.ts
import { defHttp } from '../request';
import type { ExampleListParams, ExampleListResultModel } from './model';

enum Api {
  List = '/example/list',
  Save = '/example/save',
  Update = '/example/update',
  Delete = '/example/delete',
}

/**
 * 获取示例列表
 */
export function getExampleList(params: ExampleListParams) {
  return defHttp.get<ExampleListResultModel>({
    url: Api.List,
    params,
  });
}

/**
 * 保存示例数据
 */
export function saveExample(params) {
  return defHttp.post({
    url: Api.Save,
    params,
  });
}

/**
 * 更新示例数据
 */
export function updateExample(params) {
  return defHttp.put({
    url: Api.Update,
    params,
  });
}

/**
 * 删除示例数据
 */
export function deleteExample(ids) {
  return defHttp.delete({
    url: Api.Delete,
    params: { ids },
  });
}
```

创建对应的数据模型文件：

```typescript
// apps/web-antd/src/api/example/model.d.ts
export interface ExampleListItem {
  id: string;
  name: string;
  code: string;
  status: number;
  createTime: string;
}

export interface ExampleListParams {
  name?: string;
  code?: string;
  status?: number;
  pageNum: number;
  pageSize: number;
}

export interface ExampleListResultModel {
  rows: ExampleListItem[];
  total: number;
}
```

#### 2.2 创建页面视图

在`apps/web-antd/src/views`目录下创建对应的页面组件：

```vue
<!-- apps/web-antd/src/views/example/index.vue -->
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" v-auth="['example:add']" @click="handleCreate">
          <plus-outlined />
          新增
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                auth: ['example:edit'],
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除',
                auth: ['example:remove'],
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ExampleModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { BasicTable, useTable, TableAction } from '@vben/common-ui';
import { useModal } from '@vben/hooks';
import { deleteExample, getExampleList } from '/@/api/example';
import ExampleModal from './ExampleModal.vue';

// 表格列配置
const columns = [
  {
    title: '示例名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '示例编码',
    dataIndex: 'code',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ text }) => {
      return text === 0 ? '禁用' : '启用';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
];

// 表格搜索表单配置
const searchFormSchema = [
  {
    field: 'name',
    label: '示例名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '示例编码',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];

// 注册表格
const [registerTable, { reload }] = useTable({
  title: '示例列表',
  api: getExampleList,
  columns,
  formConfig: {
    labelWidth: 100,
    schemas: searchFormSchema,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 150,
    title: '操作',
    dataIndex: 'action',
  },
});

// 注册模态框
const [registerModal, { openModal }] = useModal();

// 新增
function handleCreate() {
  openModal(true, {
    isUpdate: false,
  });
}

// 编辑
function handleEdit(record) {
  openModal(true, {
    record,
    isUpdate: true,
  });
}

// 删除
async function handleDelete(record) {
  await deleteExample(record.id);
  reload();
}

// 刷新表格
function handleSuccess() {
  reload();
}
</script>
```

创建对应的模态框组件：

```vue
<!-- apps/web-antd/src/views/example/ExampleModal.vue -->
<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import { BasicModal, useModalInner } from '@vben/common-ui';
import { BasicForm, useForm } from '@vben/common-ui';
import { saveExample, updateExample } from '/@/api/example';

// 表单配置
const formSchema = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '示例名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'code',
    label: '示例编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    required: true,
  },
];

const isUpdate = ref(false);

// 注册表单
const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 100,
  schemas: formSchema,
  showActionButtonGroup: false,
});

// 注册模态框
const [registerModal, { changeOkLoading, closeModal }] = useModalInner(
  async (data) => {
    resetFields();
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  },
);

// 标题
const getTitle = computed(() => (!unref(isUpdate) ? '新增示例' : '编辑示例'));

// 提交
async function handleSubmit() {
  try {
    changeOkLoading(true);
    const values = await validate();
    if (unref(isUpdate)) {
      await updateExample(values);
    } else {
      await saveExample(values);
    }
    closeModal();
    emit('success');
  } finally {
    changeOkLoading(false);
  }
}

const emit = defineEmits(['success', 'register']);
</script>
```

#### 2.3 配置路由

在`apps/web-antd/src/router/routes`目录下添加路由配置：

```typescript
// 添加到合适的路由模块文件中
{
  path: 'example',
  name: 'Example',
  component: () => import('/@/views/example/index.vue'),
  meta: {
    title: '示例管理',
    icon: 'ant-design:experiment-outlined',
    // 权限编码
    auth: ['example:list']
  }
}
```

### 3. 权限控制

项目使用基于角色的权限控制系统，主要通过以下方式实现：

#### 3.1 路由权限

在路由配置中通过`auth`元数据指定访问该路由所需的权限编码：

```typescript
meta: {
  // 需要'example:list'权限才能访问
  auth: ['example:list'];
}
```

#### 3.2 组件权限

在组件中使用`v-auth`指令控制元素的显示权限：

```html
<a-button v-auth="['example:add']" type="primary">新增</a-button>
```

### 4. 表单开发

本项目提供了两种表单开发方式：

#### 4.1 使用useVbenForm（推荐复杂场景）

```typescript
const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 100,
  schemas: formSchema,
  showActionButtonGroup: false,
});
```

#### 4.2 使用原生Ant Design表单（简单场景）

参考`apps/web-antd/src/views/system/notice/notice-modal.vue`文件。

### 5. 国际化

项目支持国际化，通过以下方式使用：

```typescript
import { useI18n } from '@vben/locales';

// 在setup中
const { t } = useI18n();

// 使用
const title = t('common.title');
```

添加新的翻译：在`apps/web-antd/src/locales`目录下的语言文件中添加。

### 6. 请求拦截与加密

项目支持请求/响应加密，配置位于`.env`文件中：

```properties
# 全局加密开关
VITE_GLOB_ENABLE_ENCRYPT=true
# RSA公钥 请求加密使用
VITE_GLOB_RSA_PUBLIC_KEY=...
# RSA私钥 响应解密使用
VITE_GLOB_RSA_PRIVATE_KEY=...
```

自定义请求拦截器位于`apps/web-antd/src/api/request.ts`文件中。

### 7. 主题定制

项目使用Ant Design Vue的主题定制机制，可以通过以下方式修改主题：

1. 全局样式变量位于`@vben/styles`包中
2. 主题配置位于`apps/web-antd/src/preferences.ts`文件中

### 8. 模拟数据开发

在`apps/backend-mock`目录下可以开发模拟接口用于前端开发测试：

```typescript
// apps/backend-mock/api/example/list.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // 模拟数据
  const data = {
    rows: [
      {
        id: '1',
        name: '示例1',
        code: 'example1',
        status: 1,
        createTime: '2023-01-01 00:00:00',
      },
      // 更多数据...
    ],
    total: 10,
  };

  return useResponseSuccess(data);
});
```

## 开发最佳实践

### 1. 代码风格

项目使用ESLint和Prettier进行代码风格控制，提交前会自动格式化代码。

### 2. Git提交规范

遵循Angular提交规范：

- `feat`: 新功能
- `fix`: 修复问题
- `style`: 代码风格调整
- `refactor`: 重构
- `docs`: 文档更新
- `test`: 测试
- `chore`: 构建过程或辅助工具变动

### 3. 组件复用

- 尽量使用项目提供的公共组件
- 业务组件放在对应模块的`components`目录下
- 跨模块通用组件放在`src/components`目录下

### 4. 性能优化

- 使用异步组件减少首屏加载时间
- 合理使用缓存
- 大型表格使用虚拟滚动
- 按需导入第三方库

### 5. 安全性

- 敏感信息不要硬编码
- 使用项目提供的加密机制处理敏感数据
- 防范XSS和CSRF攻击

## 常见问题

### 1. 权限问题

确保后端返回的权限编码与前端路由和组件中使用的权限编码一致。

### 2. 表单验证

使用`useForm`提供的`validate`方法进行表单验证：

```typescript
async function handleSubmit() {
  try {
    const values = await validate();
    // 处理表单提交
  } catch (error) {
    // 处理验证错误
  }
}
```

### 3. 接口错误处理

全局错误处理位于`apps/web-antd/src/api/request.ts`中，可根据需要自定义错误处理逻辑。

## 部署指南

### 1. 构建生产环境

```bash
pnpm build:antd
```

### 2. Docker部署

项目根目录下有Docker配置文件，可以使用以下命令构建Docker镜像：

```bash
docker build -t ruoyi-plus-vben5 .
```

### 3. Nginx配置

生产环境通常使用Nginx作为静态资源服务器，参考配置：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    root /path/to/dist;
    try_files $uri $uri/ /index.html;
    index index.html;
  }

  location /api {
    proxy_pass http://backend-api-url;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 参考资源

- [Vben Admin文档](https://doc.vben.pro/)
- [RuoYi-Plus文档](https://plus-doc.dromara.org/#/)
- [Vue 3文档](https://v3.vuejs.org/)
- [Ant Design Vue文档](https://antdv.com/components/overview)
- [TypeScript文档](https://www.typescriptlang.org/docs/)

## 结语

本指南提供了RuoYi-Plus-Vben5项目二次开发的基础知识和最佳实践，开发者可以根据实际需求进行扩展。在开发过程中，推荐阅读项目源码和相关文档，以便更深入地理解项目架构和设计思想。
