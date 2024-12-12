import type { TaskInfo } from './model';

import type { PageQuery, PageResult } from '#/api/common';

import { requestClient } from '#/api/request';

/**
 * 启动任务
 * @param data
 */
export function startWorkFlow(data: any) {
  return requestClient.postWithMsg<void>('/workflow/task/startWorkFlow', data);
}

/**
 * 办理任务
 * @param data
 */
export function completeTask(data: any) {
  return requestClient.postWithMsg<void>('/workflow/task/completeTask', data);
}

/**
 * 查询当前用户的待办任务
 * @param params
 */
export function pageByTaskWait(params?: PageQuery) {
  return requestClient.get<PageResult<TaskInfo>>(
    '/workflow/task/pageByTaskWait',
    { params },
  );
}

/**
 * 查询当前用户的已办任务
 * @param params
 */
export function pageByTaskFinish(params?: PageQuery) {
  return requestClient.get<PageResult<TaskInfo>>(
    '/workflow/task/pageByTaskFinish',
    { params },
  );
}

/**
 * 查询所有待办任务
 * @param params
 */
export function pageByAllTaskWait(params?: PageQuery) {
  return requestClient.get<PageResult<TaskInfo>>(
    '/workflow/task/pageByAllTaskWait',
    { params },
  );
}

/**
 * 查询已办任务
 * @param params
 */
export function pageByAllTaskFinish(params?: PageQuery) {
  return requestClient.get<PageResult<TaskInfo>>(
    '/workflow/task/pageByAllTaskFinish',
    { params },
  );
}

/**
 * 查询当前用户的抄送
 * @param params
 */
export function pageByTaskCopy(params?: PageQuery) {
  return requestClient.get<PageResult<TaskInfo>>(
    '/workflow/task/pageByTaskCopy',
    { params },
  );
}

/**
 * 根据taskId查询代表任务
 * @param taskId 任务id
 * @returns info
 */
export function getTaskByTaskId(taskId: string) {
  return requestClient.get<TaskInfo>(`/workflow/task/${taskId}`);
}
