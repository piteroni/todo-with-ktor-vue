import { injectable } from "inversify"
import { AxiosInstance } from "axios"
import { CreatedRetainedTask, RetainedTaskListAcquirationResponse } from "./types"
import { Core } from "@/providers/containers"
import { types } from "@/providers/types"

export const resource = "/users/current"

@injectable()
export class CurrentUser {
  @Core(types.core.authenticatedAxios)
  private $api!: AxiosInstance

  /**
   * 保有タスクを作成する.
   *
   * @param name
   *   タスク名
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  public async createRetainedTask(name: string): Promise<CreatedRetainedTask> {
    const data = { name }

    return (await this.$api.post<CreatedRetainedTask>(`${resource}/tasks`, data)).data
  }

  // createRetainedTask

  /**
   * 保有タスクリストを取得する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  public async getRetainedTaskList(): Promise<RetainedTaskListAcquirationResponse> {
    return (await this.$api.get<RetainedTaskListAcquirationResponse>(`${resource}/tasks`)).data
  }

  /**
   * 保有タスクを削除する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  public async deleteRetainedTask(taskId: number): Promise<void> {
    await this.$api.delete(`${resource}/tasks/${taskId}`)
  }
}
