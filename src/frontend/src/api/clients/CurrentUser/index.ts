import { injectable } from "inversify"
import { AxiosInstance } from "axios"
import { AxiosInstanceFactory } from "@/api/lib/client"
import { RetainedTaskAcquirationResponse } from "./types"
import { ICurrentUser } from "./declare"

export const resource = "/users/current"

@injectable()
export class CurrentUser implements ICurrentUser {
  private api: AxiosInstance

  constructor() {
    this.api = AxiosInstanceFactory.auth()
  }

  public async getRetainedTaskList(): Promise<RetainedTaskAcquirationResponse> {
    return (await this.api.get<RetainedTaskAcquirationResponse>(`${resource}/tasks`)).data
  }
}
