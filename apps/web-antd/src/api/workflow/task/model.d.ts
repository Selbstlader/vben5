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
  formPath?: any;
  flowCode: string;
  version: string;
  flowStatus: string;
  flowStatusName: string;
  assigneeIds: string;
  assigneeNames: string;
  processedBy: string;
  type: string;
  nodeRatio?: any;
  createBy: string;
  createByName: string;
}

export interface CompleteTaskReqData {
  messageType: string[];
  flowCopyList: { userId: string; userName: string }[];
  taskId: ID;
  taskVariables: Record<string, any>;
  variables: any;
  // 附件ID 1,2,3,4形式
  fileId?: string;
}

export interface StartWorkFlowReqData {
  /**
   * 业务ID
   */
  businessKey: ID;
  /**
   * flowCode
   */
  flowCode: string;
  /**
   * 流程变量
   */
  variables: Record<string, any>;
}
