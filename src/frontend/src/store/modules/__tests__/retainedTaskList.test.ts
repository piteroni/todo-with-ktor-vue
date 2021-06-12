import Vuex, { Store } from "vuex"
import { createLocalVue } from "@vue/test-utils"
import { RetainedTask, retainedTaskList, RetainedTaskListContext, RetainedTaskListState } from "@/store/modules/retainedTaskList"
import { mock } from "@/lib/testing/vuex"
import { apiContainer } from "@/providers/containers"
import { CurrentUser } from "@/api/clients/CurrentUser"
import { types } from "@/providers/types"
import { createMock } from "@/lib/testing/lib"
import { RetainedTaskAcquirationResponse } from "@/api/clients/CurrentUser/types"

const localVue = createLocalVue()

localVue.use(Vuex)

describe("保有タスクリスト", () => {
  let store: Store<{ retainedTaskList: RetainedTaskListState }>
  let context: RetainedTaskListContext

  beforeEach(() => {
    const mocked = mock(retainedTaskList).withKey("retainedTaskList").build()

    store = mocked.store
    context = mocked.context
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("actions", () => {
    it("サーバーから保有タスクリストを取得できる", async () => {
      const getRetainedTaskListMock = jest.fn((): RetainedTaskAcquirationResponse => {
        return [{
          id: 0,
          name: ""
        }]
      })

      const currentUserMock = createMock(CurrentUser, {
        async getRetainedTaskList() {
          return getRetainedTaskListMock()
        }
      })

      const expected: RetainedTask[] = [{
        id: 0,
        name: ""
      }]

      apiContainer.rebind<CurrentUser>(types.api.CurrentUser).toConstantValue(currentUserMock)

      await context.actions.fetch()

      expect(getRetainedTaskListMock).toBeCalledTimes(1)
      expect(store.state.retainedTaskList.tasks).toEqual(expected)
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
      expect(store.state.retainedTaskList.tasks).toEqual(expected)
      expect(context.state.tasks).toEqual(expected)
    })
  })
})
