import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, mount } from "@vue/test-utils"
import { mock } from "@/lib/testing/vuex"
import { retainedTask, RetainedTaskActions, RetainedTaskContext } from "@/store/modules/retainedTask"
import { vuexContextContainer } from "@/providers/containers"
import { types } from "@/providers/types"
import TaskCreateForm from "@/pages/ManageTask/TaskCreateForm.vue"
import { useStderrMock, waitUntilForDone, waitUntilForMounted } from "@/shared/testing"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)

describe("タスク作成フォーム", () => {
  const vuetify = new Vuetify()

  beforeEach(() => {
    const context = mock(retainedTask).withKey("retainedTask").build().context

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("タスク情報を送信すると、タスク作成処理が行われる", async () => {
    const createTaskMock = jest.fn()

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async createTask(name: string) {
          createTaskMock(name)
        }
      })
      .build()

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    const taskCreateForm = mount(TaskCreateForm, {
      localVue,
      vuetify,
    })

    await waitUntilForMounted()

    await taskCreateForm.find(".taskInput input").setValue("new-task")
    await taskCreateForm.find(".taskCreateButton").trigger("click")

    await waitUntilForDone()

    /* Vuex上での保有タスク作成処理が呼ばれる */
    expect(createTaskMock).toBeCalledTimes(1)
    expect(createTaskMock).toBeCalledWith("new-task")
    /* 保有タスク作成処理後、タスク名は空になる */
    expect((taskCreateForm.find(".taskInput input").element as HTMLInputElement).value).toBe("")
  })

  describe("タスク入力欄バリデーション", () => {
    it("タスク入力欄が空の状態でタスク作成ボタンを押下すると、エラーメッセージが表示され、タスク作成処理は実施されない", async () => {
      const taskCreateForm = mount(TaskCreateForm, {
        localVue,
        vuetify,
      })

      await waitUntilForMounted()

      await taskCreateForm.find(".taskInput input").setValue("")
      await taskCreateForm.find(".taskCreateButton").trigger("click")

      await waitUntilForDone()

      expect(taskCreateForm.find(".taskInput .v-messages__message").text()).toBe("タスクを入力してください")
    })

    it("タスク入力欄に257文字以上の文字が入力された状態でタスク作成ボタンを押下すると、エラーメッセージが表示され、タスク作成処理は実施されない", async () => {
      const taskCreateForm = mount(TaskCreateForm, {
        localVue,
        vuetify,
      })

      await waitUntilForMounted()

      await taskCreateForm.find(".taskInput input").setValue("a".repeat(257))
      await taskCreateForm.find(".taskCreateButton").trigger("click")

      await waitUntilForDone()

      expect(taskCreateForm.find(".taskInput .v-messages__message").text()).toBe("タスクは256文字以内で入力してください")
    })
  })

  it("保有タスク作成処理に失敗すると、エラーが通知される", async () => {
    const createTaskMock = jest.fn()

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async createTask() {
          createTaskMock()
          throw new Error()
        }
      })
      .build()

    const error = useStderrMock()
    const fatal = jest.fn()

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    const taskCreateForm = mount(TaskCreateForm, {
      localVue,
      vuetify,
      mocks: {
        $notify: {
          fatal
        }
      }
    })

    await waitUntilForMounted()

    await taskCreateForm.find(".taskInput input").setValue("__stub__")
    await taskCreateForm.find(".taskCreateButton").trigger("click")

    await waitUntilForDone()

    expect(createTaskMock).toBeCalledTimes(1)
    expect(error).toBeCalledTimes(1)
    expect(error.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(fatal).toBeCalledTimes(1)
  })
})
