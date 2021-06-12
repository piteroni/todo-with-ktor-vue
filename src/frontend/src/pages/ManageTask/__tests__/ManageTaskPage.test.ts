import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import { serviceContainer, vuexContextContainer } from "@/providers/containers"
import { Redirector } from "@/lib/middleware/Redirector"
import { types } from "@/providers/types"
import ManageTaskPage from "../ManageTaskPage.vue"
import { createMock } from "@/lib/testing/lib"
import { RedirectorStub } from "@/lib/testing/stubs"
import { useStderrMock, waitUntilForMounted } from "@/shared/testing"
import { retainedTask, RetainedTaskContext, RetainedTaskActions } from "@/store/modules/retainedTask"
import { mock } from "@/lib/testing/vuex"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)

describe("タスク管理画面", () => {
  let vuetify = new Vuetify()

  beforeEach(() => {
    vuetify = new Vuetify()

    const { context } = mock(retainedTask).withKey("retainedTask").build()

    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)
    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(new RedirectorStub())
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("初期画面表示時にローディング画面が表示される", () => {
    const manageTaskPage = shallowMount(ManageTaskPage, {
      localVue,
      vuetify
    })

    // mountedが完了すると、テストは失敗する.
    expect(manageTaskPage.find("loading-stub").exists()).toBeTruthy()
    expect(manageTaskPage.find(".manageTask").exists()).toBeFalsy()
  })

  it("初期表示時に認証ステータスに応じたリダイレクト処理が行われる", async () => {
    const redirectIfUnauthenticatedMock = jest.fn(() => Promise.resolve(true))

    const redirectorMock = createMock<Redirector>(RedirectorStub, {
      redirectIfUnauthenticated() {
        return redirectIfUnauthenticatedMock()
      }
    })

    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(redirectorMock)

    shallowMount(ManageTaskPage, {
      localVue,
      vuetify
    })

    await waitUntilForMounted()

    expect(redirectIfUnauthenticatedMock).toBeCalledTimes(1)
  })

  it("初期表示時に保有タスクリスト取得処理が行われる", async () => {
    const fetchTasksMock = jest.fn()
    const redirectIfUnauthenticatedMock = jest.fn(() => Promise.resolve(false))

    const redirectorMock = createMock<Redirector>(RedirectorStub, {
      redirectIfUnauthenticated() {
        return redirectIfUnauthenticatedMock()
      }
    })

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async fetchTasks() {
          fetchTasksMock()
        }
      })
      .build()

    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(redirectorMock)
    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    shallowMount(ManageTaskPage, {
      localVue,
      vuetify
    })

    await waitUntilForMounted()

    expect(redirectIfUnauthenticatedMock).toBeCalledTimes(1)
    expect(fetchTasksMock).toBeCalledTimes(1)
  })

  it("保有タスクリスト取得処理に失敗した場合、エラーが通知される", async () => {
    const error = useStderrMock()
    const fatal = jest.fn()

    const fetchTasksMock = jest.fn()
    const redirectIfUnauthenticatedMock = jest.fn(() => Promise.resolve(false))

    const redirectorMock = createMock<Redirector>(RedirectorStub, {
      redirectIfUnauthenticated() {
        return redirectIfUnauthenticatedMock()
      }
    })

    const { context } = mock(retainedTask)
      .withKey("retainedTask")
      .withActions(class extends RetainedTaskActions {
        async fetchTasks() {
          fetchTasksMock()
          throw new Error()
        }
      })
      .build()

    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(redirectorMock)
    vuexContextContainer.rebind<RetainedTaskContext>(types.vuexContext.retainedTask).toConstantValue(context)

    shallowMount(ManageTaskPage, {
      localVue,
      vuetify,
      mocks: {
        $notify: {
          fatal
        }
      }
    })

    await waitUntilForMounted()

    expect(redirectIfUnauthenticatedMock).toBeCalledTimes(1)
    expect(fetchTasksMock).toBeCalledTimes(1)
    expect(error).not.toBeCalledWith("")
    expect(fatal).toBeCalledTimes(1)
  })
})
