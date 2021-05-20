import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import { types } from "@/providers/types"
import { container as vuexContextContainer } from "@/providers/containers/vuexContext"
import Login from "@/pages/Login/LoginPage.vue"
import * as fixtures from "./fixtures/login"
import { routes, setUpVuexModule } from "./fixtures/shared"
import { waitUntilForMounted, useStderrMock } from "@/shared/testing"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(VueRouter)

describe("Login.vue", () => {
  let vuetify = new Vuetify()
  let router: VueRouter

  beforeAll(() => {
    window.localStorage.clear()
  })

  beforeEach(() => {
    vuetify = new Vuetify()

    router = new VueRouter({
      mode: "abstract",
      routes,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()

    window.localStorage.clear()
  })

  it("初期画面表示時にローディング画面が表示される", async () => {
    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    })

    // mountedが完了すると、テストは失敗する.
    expect(login.find("loading-stub").exists()).toBeTruthy()
    expect(login.find("login-form-stub").exists()).toBeFalsy()
  })

  describe("認証トークンの検証処理", () => {
    it("ローカルストレージに認証トークンが保存されていない場合、ログインページが表示される", async () => {
      // "/"がデフォルトで設定されているのでパスを明示的に指定
      router.push("/login")

      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      // 認証トークン検証処理が呼ばれないことを確認する
      expect(fixtures.verifyCrediantialsMock).not.toBeCalled()

      // Locationが推移しないことを確認する
      expect(login.vm.$route.path).toBe("/login")
    })

    it("ローカルストレージに認証トークンが有効でない場合、ログインページが表示される", async () => {
      const { context } = setUpVuexModule(fixtures.ApiTokenActionsMockWithAuthFailure)

      vuexContextContainer.rebind(types.vuexContext.apiToken).toConstantValue(context)

      // 認証トークンを保存することで認証トークンの検証まで処理を進める
      window.localStorage.setItem("api-token", "token-stub")

      router.push("/login")

      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      expect(fixtures.verifyCrediantialsMock).toBeCalledTimes(1)
      expect(login.vm.$route.path).toBe("/login")
    })

    it("認証トークンの検証中に例外が発生した場合に、エラーメッセージが通知される", async () => {
      const { context } = setUpVuexModule(fixtures.ApiTokenActionsMockWithException)

      vuexContextContainer.rebind(types.vuexContext.apiToken).toConstantValue(context)

      const stderr = useStderrMock()

      const fatal = jest.fn()

      shallowMount(Login, {
        localVue,
        vuetify,
        router,
        mocks: {
          $notify: {
            fatal
          }
        }
      })

      await waitUntilForMounted()

      expect(fixtures.verifyCrediantialsMock).toBeCalled()
      expect(stderr).toBeCalledTimes(1)
      expect(fatal).toBeCalledTimes(1)
    })

    it("認証済みの場合に、ダッシュボード画面に推移する", async () => {
      const { context } = setUpVuexModule(fixtures.ApiTokenActionsMockWithAuthed)

      vuexContextContainer.rebind(types.vuexContext.apiToken).toConstantValue(context)

      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      expect(fixtures.verifyCrediantialsMock).toBeCalledTimes(1)
      expect(login.vm.$route.path).toBe("/tasks")
    })
  })
})
