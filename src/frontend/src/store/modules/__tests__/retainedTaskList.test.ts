import Vuex, { Store } from "vuex"
import { createLocalVue } from "@vue/test-utils"
import { RetainedTask, retainedTask, RetainedTaskContext, RetainedTaskState } from "@/store/modules/retainedTask"
import { mock } from "@/lib/testing/vuex"
import { apiContainer } from "@/providers/containers"
import { CurrentUser } from "@/api/clients/CurrentUser"
import { types } from "@/providers/types"
import { createMock } from "@/lib/testing/lib"
import { RetainedTaskCreateResponose, RetainedTaskListAcquirationResponse } from "@/api/clients/CurrentUser/types"

const localVue = createLocalVue()

localVue.use(Vuex)

describe("保有タスクリスト", () => {
  let store: Store<{ retainedTask: RetainedTaskState }>
  let context: RetainedTaskContext

  beforeEach(() => {
    const mocked = mock(retainedTask).withKey("retainedTask").build()

    store = mocked.store
    context = mocked.context
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("actions", () => {
    it("保有タスクを作成できる", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createRetainedTaskMock = jest.fn((...args: any[]): RetainedTaskCreateResponose => {
        return {
          taskId: 99,
          name: "task-99"
        }
      })

      const currentUserMock = createMock(CurrentUser, {
        async createRetainedTask(name: string) {
          return createRetainedTaskMock(name)
        }
      })

      const expected: RetainedTask[] = [
        {
          id: 98,
          name: "task-98"
        },
        {
          id: 99,
          name: "task-99"
        }
      ]

      apiContainer.rebind<CurrentUser>(types.api.CurrentUser).toConstantValue(currentUserMock)

      context.state.tasks = [{
        id: 98,
        name: "task-98"
      }]

      await context.actions.createTask("task-name")

      /* 保有タスク作成APIが呼ばれる */
      expect(createRetainedTaskMock).toBeCalledTimes(1)
      expect(createRetainedTaskMock).toBeCalledWith("task-name")
      /* 保有タスク作成APIの返り値がStateに追加される */
      expect(context.state.tasks).toEqual(expected)
      expect(store.state.retainedTask.tasks).toEqual(expected)
    })

    it("サーバーから保有タスクリストを取得できる", async () => {
      const getRetainedTaskMock = jest.fn((): RetainedTaskListAcquirationResponse => {
        return [{
          id: 0,
          name: ""
        }]
      })

      const currentUserMock = createMock(CurrentUser, {
        async getRetainedTaskList() {
          return getRetainedTaskMock()
        }
      })

      const expected: RetainedTask[] = [{
        id: 0,
        name: ""
      }]

      apiContainer.rebind<CurrentUser>(types.api.CurrentUser).toConstantValue(currentUserMock)

      await context.actions.fetchTasks()

      expect(getRetainedTaskMock).toBeCalledTimes(1)
      expect(store.state.retainedTask.tasks).toEqual(expected)
      expect(context.state.tasks).toEqual(expected)
    })

    it("保有タスクを削除できる", async () => {
      const deleteRetainedTaskMock = jest.fn()

      const currentUserMock = createMock(CurrentUser, {
        async deleteRetainedTask(taskId: number) {
          deleteRetainedTaskMock(taskId)
        }
      })

      const beforeState: RetainedTask[] = [
        {
          id: 100,
          name: "task-100"
        },
        {
          id: 101,
          name: "task-101"
        },
      ]

      const expected: RetainedTask[] = [{
        id: 101,
        name: "task-101"
      }]

      apiContainer.rebind<CurrentUser>(types.api.CurrentUser).toConstantValue(currentUserMock)

      context.state.tasks = beforeState

      await context.actions.deleteTask(100)

      expect(deleteRetainedTaskMock).toBeCalledTimes(1)
      expect(deleteRetainedTaskMock).toBeCalledWith(100)
      expect(store.state.retainedTask.tasks).toEqual(expected)
      expect(context.state.tasks).toEqual(expected)
    })
  })
})
