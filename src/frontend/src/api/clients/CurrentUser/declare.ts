import { RetainedTaskAcquirationResponse } from "./types";

export interface ICurrentUser {
  /**
   * 保有タスクリストを取得する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  getRetainedTaskList(): Promise<RetainedTaskAcquirationResponse>
}
