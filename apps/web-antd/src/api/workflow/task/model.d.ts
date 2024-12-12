export interface TaskInfo {
  id: string;
  createTime: string;
  updateTime: string;
  tenantId: string;
  delFlag?: any;
  definitionId: string;
  instanceId: string;
  flowName: string;
  businessId: string;
  nodeCode: string;
  nodeName: string;
  nodeType: number;
  permissionList?: any;
  userList?: any;
  formCustom: string;
  formPath: string;
  flowCode: string;
  version: string;
  flowStatus: string;
  flowStatusName: string;
  transactorNames: string;
  processedBy: string;
  type: string;
  nodeRatio?: any;
  nickName: string;
}
