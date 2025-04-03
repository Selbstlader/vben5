# 1.3.0更新说明

注意: 如果你使用老版本的`文件上传`/`图片上传` 可暂时使用

- `component: 'ImageUploadOld'`
- `component: 'FileUploadOld'`

代替 **建议替换为新版本**

大致变动:

- `accept string[] -> string`
- `resultField 已经移除 统一使用ossId`
- `maxNumber -> maxCount`

具体参数查看: `apps/web-antd/src/components/upload/src/props.d.ts`

不再推荐使用useDescription, 这个版本会标记为@deprecated, 下个次版本将会移除

框架所有使用useDescription组件的会替换为原生(TODO)

**REFACTOR**

- **文件上传/图片上传重构(破坏性更新 不兼容之前的api)**
- **文件上传/图片上传**不再支持**url用法 强制使用ossId**
- TableSwitch组件重构
- 管理员租户切换不再返回首页 直接刷新当前页(除特殊页面外会回到首页)
- modalLoading/drawerLoading改为调用内部的lock/unlock方法
- 登录验证码 增加loading
- 框架所有使用useDescription组件的替换为原生antd

**BUG FIX**

- 重新登录 字典会unknown的情况[详细分析](https://gitee.com/dapppp/ruoyi-plus-vben5/issues/IBY27D)
- 测试菜单 请假申请 选中删除 需要根据状态判断
- 修复文件/图片在Safari中无法上传 file-type库与Safari不兼容导致

**OTHER**

- 字典管理 字典类型 表格选中行增加bold效果
- 全局圆角修改 与antd保持一致
- vditor(Markdown)升级3.10.9
