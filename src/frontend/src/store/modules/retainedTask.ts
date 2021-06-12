import { Actions, Module } from "vuex-smart-module"
import { Api } from "@/providers/containers"
import { types } from "@/providers/types"
import { CurrentUser } from "@/api/clients/CurrentUser"

export interface RetainedTask {
  id: number
  name: string
}

export interface RetainedTaskState {
  tasks: RetainedTask[]
}

class State implements RetainedTaskState {
  public tasks: RetainedTask[] = []
}

export class RetainedTaskActions extends Actions<RetainedTaskState> {
  @Api(types.api.CurrentUser)
  private $currentUser!: CurrentUser;

  /**
   * サーバーから保有タスクリストを取得し、Stateに保存する.
   *
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *   APIとの通信時にエラーが発生した場合に送出される.
   */
  public async fetchTasks(): Promise<void> {
    this.state.tasks = await this.$currentUser.getRetainedTaskList()
  }

  /**
   * 指定された保有タスクを削除する.
   *
   * @param taskId
   *   削除する保有タスクのID.
   * @throws {@/api/lib/shared/exceptions#ApiError}
   *   APIとの通信時にエラーが発生した場合に送出される.
   */
  public async deleteTask(taskId: number): Promise<void> {
    await this.$currentUser.deleteRetainedTask(taskId)

    const tasks = this.state.tasks.filter(t => t.id !== taskId)

    this.state.tasks = tasks
  }
}

export const retainedTask = new Module({
  state: State,
  actions: RetainedTaskActions
})

export type RetainedTaskContext = ReturnType<typeof retainedTask.context>
