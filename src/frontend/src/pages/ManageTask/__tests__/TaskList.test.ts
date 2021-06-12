import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, mount } from "@vue/test-utils"
import { mock } from "@/lib/testing/vuex"
import { vuexContextContainer } from "@/providers/containers"
import { retainedTask, RetainedTaskActions, RetainedTaskContext } from "@/store/modules/retainedTask"
import { types } from "@/providers/types"
import TaskList from "@/pages/ManageTask/TaskList.vue"
import { useStderrMock, waitUntilForDone, waitUntilForMounted } from "@/shared/testing"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)

describe("保有タスクリスト", () => {
  let vuetify = new Vuetify()
  let context: RetainedTaskContext

  beforeEach(() => {
    vuetify = new Vuetify()

    context = mock(retainedTask).withKey("retainedTask").build().context

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("初期表示時に保有タスクリストが表示される", async () => {
    context.state.tasks = [
      {
        id: 1,
        name: "task-1"
      },
      {
        id: 2,
        name: "task-2"
      }
    ]

    const taskList = mount(TaskList, {
      localVue,
      vuetify,
    })

    await waitUntilForMounted()

    const tasks = taskList.findAll(".taskList .task")

    expect(tasks.exists()).toBeTruthy()
    expect(tasks.length).toBe(2)
    expect(tasks.at(0).text()).toBe("task-1")
    expect(tasks.at(1).text()).toBe("task-2")
  })

  it("タスク削除ボタンを押下すると、タスク削除処理を呼ばれる", async () => {
    const deleteTaskMock = jest.fn()

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async deleteTask(taskId: number) {
          deleteTaskMock(taskId)
        }
      })
      .build()

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    context.state.tasks = [
      {
        id: 92,
        name: "task-92"
      }
    ]

    const taskList = mount(TaskList, {
      localVue,
      vuetify,
    })

    await taskList.find(".taskList .task .taskDeleteButton").trigger("click")

    await waitUntilForDone()

    expect(deleteTaskMock).toBeCalledTimes(1)
    expect(deleteTaskMock).toBeCalledWith(92)
  })

  it("タスク削除処理に失敗すると、エラーが通知される", async () => {
    const deleteTaskMock = jest.fn()
    const fatal = jest.fn()

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async deleteTask() {
          deleteTaskMock()
          throw new Error()
        }
      })
      .build()

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    context.state.tasks = [
      {
        id: 1,
        name: "task-1"
      }
    ]

    const error = useStderrMock()

    const taskList = mount(TaskList, {
      localVue,
      vuetify,
      mocks: {
        $notify: {
          fatal
        }
      }
    })

    await taskList.find(".taskList .task .taskDeleteButton").trigger("click")

    await waitUntilForDone()

    expect(deleteTaskMock).toBeCalledTimes(1)
    expect(error).toBeCalledTimes(1)
    expect(error.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(fatal).toBeCalledTimes(1)
  })
})
