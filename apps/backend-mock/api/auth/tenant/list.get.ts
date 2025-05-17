import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async () => {
  // 模拟租户列表数据
  return useResponseSuccess({
    code: 200,
    msg: '操作成功',
    rows: [
      {
        id: '1',
        tenantId: '000000',
        contactUserName: '管理员',
        contactPhone: '15888888888',
        companyName: '若依科技有限公司',
        licenseNumber: '1234567890',
        address: '北京市朝阳区',
        intro: '若依科技有限公司',
        domain: '',
        packageId: '1',
        packageName: 'VIP套餐',
        status: '0',
        delFlag: '0',
        createDept: '103',
        createBy: '1',
        createTime: '2023-01-01 00:00:00',
        updateBy: '',
        updateTime: null,
        expire: '2099-12-31 00:00:00',
        accountCount: -1,
      },
    ],
    total: 1,
  });
});
