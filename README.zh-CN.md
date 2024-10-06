[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE) <h1>ruoYi plus vben5</h1>

## 提示

该仓库使用vben最新版本v5开发, 老版本v2地址[前往](https://gitee.com/dapppp/ruoyi-plus-vben)

## 简介

基于 [vben5 & ant-design-vue)](https://github.com/vbenjs/vue-vben-admin) 的 RuoYi-Vue-Plus 前端项目

| 组件/框架      | 版本  |
| :------------- | :---- |
| vben           | 5.31  |
| ant-design-vue | 4.2.5 |
| vue            | 3.5.1 |

对应后端项目: **(分布式 5.X 分支 微服务 2.分支)**

分布式 [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus/tree/5.X/)

微服务 [RuoYi-Cloud-Plus](https://gitee.com/dromara/RuoYi-Cloud-Plus/tree/2.X/)

## 预览

admin 账号: admin admin123

[预览地址点这里](http://vben5.dapdap.top)

## WX Group

暂不开放

## 文档

[vben 文档地址](https://doc.vvbin.cn/)

[RuoYi-Plus 文档地址](https://plus-doc.dromara.org/#/)

## 预览图

![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/1.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/2.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/3.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/4.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/5.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/6.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/7.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/8.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/9.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/10.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/11.png) ![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/12.png)

## 安装使用

前置准备环境(只能用pnpm)

```json
"packageManager": "pnpm",
"engines": {
  "node": ">=20.10.0",
  "pnpm": ">=9.5.0"
},
```

- 获取项目代码

```bash
git clone https://gitee.com/dapppp/ruoyi-plus-vben5.git
```

- 安装依赖

```bash
cd ruoyi-plus-vben5

pnpm install
```

- 关于代码生成(非必选)

v5版本代码生成模板为付费功能

- 关于一些监控的地址配置(微服务版本可以跳过这一小节)

使用[RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus/tree/5.X/)注意 `已经去除 admin/snailjob 的.env 配置` 可自行修改 有两种方式

1. 修改源码`/views/monitor/admin` `views/monitor/snailjob`

```ts
// 修改地址
const url = ref<string>('http://127.0.0.1:7700/#/oms/home');
```

2. **推荐** 使用菜单自行配置 (跟 cloud 版本打开方式一致)

![图片](https://gitee.com/dapppp/ruoyi-plus-vben/raw/main/preview/菜单修改.png)

使用内嵌 iframe 方式需要解决跨域问题 可参考[nginx.conf](https://gitee.com/dromara/RuoYi-Vue-Plus/blob/5.X/script/docker/nginx/conf/nginx.conf#LC87)配置

- 修改.env.development 配置文件
- **注意 RSA 公私钥一定要修改和后端匹配**
- RSA 公私钥为两对 `前端请求加密-后端解密是一对` `后端响应加密 前端解密是一对`

```properties
# 端口号
VITE_PORT=5666

VITE_BASE=/
# 是否开启 Nitro Mock服务，true 为开启，false 为关闭
VITE_NITRO_MOCK=false
# 是否打开 devtools，true 为打开，false 为关闭
VITE_DEVTOOLS=false
# 是否注入全局loading
VITE_INJECT_APP_LOADING=true

# 后台请求路径 具体在vite.config.mts配置代理
VITE_GLOB_API_URL=/api

# 全局加密开关(即开启了加解密功能才会生效 不是全部接口加密 需要和后端对应)
VITE_GLOB_ENABLE_ENCRYPT=true
# RSA公钥 请求加密使用 注意这两个是两对RSA公私钥 请求加密-后端解密是一对 响应解密-后端加密是一对
VITE_GLOB_RSA_PUBLIC_KEY=
# RSA私钥 响应解密使用 注意这两个是两对RSA公私钥 请求加密-后端解密是一对 响应解密-后端加密是一对
VITE_GLOB_RSA_PRIVATE_KEY=
# 客户端id
VITE_GLOB_APP_CLIENT_ID=e5cd7e4891bf95d1d19206ce24a7b32e

# 开启WEBSOCKET
VITE_GLOB_WEBSOCKET_ENABLE=false
```

- 运行

```bash
pnpm serve
```

- 打包

```bash
pnpm build
```

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

最低适配应该为`Chrome 88+`以上浏览器 详见 [css - where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where#browser_compatibility)

本地开发推荐使用`Chrome` 最新版本浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 捐赠

如果项目帮助到您 可以考虑请作者喝杯咖啡 万分感谢您对开源的支持!

<img src=https://plus.dapdap.top/minio-server/plus/2024/03/16/98a9d704eb0c4c04b721bf7799217571.jpg height=360px />
