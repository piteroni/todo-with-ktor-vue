import { injectable } from "inversify"
import { AxiosInstance } from "axios"
import { RetainedTaskAcquirationResponse } from "./types"
import { Core } from "@/providers/containers"
import { types } from "@/providers/types"

export const resource = "/users/current"

@injectable()
export class CurrentUser {
  @Core(types.core.authenticatedAxios)
  private $api!: AxiosInstance

  /**
   * 保有タスクリストを取得する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  public async getRetainedTaskList(): Promise<RetainedTaskAcquirationResponse> {
    return (await this.$api.get<RetainedTaskAcquirationResponse>(`${resource}/tasks`)).data
  }
}
