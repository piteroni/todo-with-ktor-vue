import { injectable } from "inversify"
import { AxiosInstance } from "axios"
import { AxiosInstanceFactory } from "@/api/lib/client"
import { RetainedTaskAcquirationResponse } from "./types"

export const resource = "/users/current"

@injectable()
export class CurrentUser {
  private api: AxiosInstance

  constructor() {
    this.api = AxiosInstanceFactory.auth()
  }

  /**
   * 保有タスクリストを取得する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *  APIとの通信時にエラーが発生した場合に送出される.
   */
  public async getRetainedTaskList(): Promise<RetainedTaskAcquirationResponse> {
    return (await this.api.get<RetainedTaskAcquirationResponse>(`${resource}/tasks`)).data
  }
}
