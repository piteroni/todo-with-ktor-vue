import { Actions, Module } from "vuex-smart-module"
import { Api } from "@/providers/containers"
import { types } from "@/providers/types"
import { CurrentUser } from "@/api/clients/CurrentUser"

export interface RetainedTask {
  id: number
  name: string
}

export interface RetainedTaskListState {
  tasks: RetainedTask[]
}

class RetainedTaskList implements RetainedTaskListState {
  public tasks: RetainedTask[] = []
}

class RetainedTaskListActions extends Actions<RetainedTaskListState> {
  @Api(types.api.CurrentUser)
  private $currentUser!: CurrentUser;

  /**
   * サーバーから保有タスクリストを取得し、Stateに保存する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *   APIとの通信時にエラーが発生した場合に送出される.
   */
  public async fetch(): Promise<void> {
    const retainedTaskList = await this.$currentUser.getRetainedTaskList()

    this.state.tasks = retainedTaskList
  }
}

export const retainedTaskList = new Module({
  state: RetainedTaskList,
  actions: RetainedTaskListActions
})

export type RetainedTaskListContext = ReturnType<typeof retainedTaskList.context>
