import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import { mount, createLocalVue, shallowMount } from "@vue/test-utils"
import { types } from "@/providers/types"
import { container as vuexContextContainer } from "@/providers/containers/vuexContext"
import { FetchAuthenticationTokenParameter } from "@/store/modules/authenticationToken"
import LoginForm from "@/pages/Login/LoginForm.vue"
import { waitUntilForMounted, waitUntilForDone, useStderrMock } from "@/shared/testing"
import * as fixtures from "./fixtures/loginForm"
import { routes, setUpVuexModule } from "./fixtures/shared"

Vue.use(Vuetify)
Vue.use(VueRouter)

const localVue = createLocalVue()

describe("LoginForm.vue", () => {
  let vuetify = new Vuetify()
  let router: VueRouter

  beforeEach(() => {
    vuetify = new Vuetify()

    router = new VueRouter({
      mode: "abstract",
      routes,
    })

    const { context } = setUpVuexModule(fixtures.AuthenticationTokenActionsMock)

    vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(context)
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it("ユーザーアカウント情報を送信すると、ログイン処理が呼び出される", async () => {
    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    })

    const expected: FetchAuthenticationTokenParameter = {
      email: "user@example.com",
      password: "password"
    }

    await waitUntilForMounted()

    await loginForm.find(".email input").setValue("user@example.com")
    await loginForm.find(".password input").setValue("password")
    await loginForm.find(".loginButton").trigger("click")

    await waitUntilForDone()

    // 認証処理が呼ばれること
    expect(fixtures.fetchAuthenticationTokenMock).toBeCalledTimes(1)
    expect(fixtures.fetchAuthenticationTokenMock).toBeCalledWith(expected)

    // タスク管理画面に推移すること
    expect(loginForm.vm.$route.path).toBe("/tasks")
  })

  it("認証に失敗すると、認証に失敗した旨が表示されログイン処理が中断される", async () => {
    const { context } = setUpVuexModule(fixtures.AuthenticationTokenActionsMockWithAuthFailure)

    vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(context)

    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    await loginForm.find(".email input").setValue("user@example.com")
    await loginForm.find(".password input").setValue("password")
    await loginForm.find(".loginButton").trigger("click")

    await waitUntilForDone()

    // 認証処理が呼ばれること
    expect(fixtures.fetchAuthenticationTokenMockWithAuthFailure).toBeCalledTimes(1)

    // エラーメッセージが表示されていること
    expect(loginForm.find(".failureMessage").text()).not.toBe("")

    // タスク管理画面へ推移しないこと
    expect(loginForm.vm.$route.path).not.toBe("/tasks")
  })

  it("認証中に例外が発生した場合に、エラーメッセージが通知される", async () => {
    const { context } = setUpVuexModule(fixtures.AuthenticationTokenActionsMockWithException)

    vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(context)

    const stderr = useStderrMock()

    const fatal = jest.fn()

    const loginForm = mount(LoginForm, {
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

    await loginForm.find(".email input").setValue("user@example.com")
    await loginForm.find(".password input").setValue("password")
    await loginForm.find(".loginButton").trigger("click")

    await waitUntilForDone()

    expect(fixtures.fetchWithException).toBeCalledTimes(1)
    expect(stderr).toBeCalledTimes(1)
    expect(fatal).toBeCalledTimes(1)
  })

  it("リダイレクトが実施された場合、再ログインを要求する旨のメッセージが表示される", async () => {
    router.push("/login?isRedirect=true")

    const loginForm = shallowMount(LoginForm, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    expect(loginForm.find(".redirectMessage").text()).not.toBe("")
  })

  it("ユーザーアカウント情報を送信すると、URLのクエリやメッセージが初期化される", async () => {
    router.push("/login?isRedirect=true")

    const { context } = setUpVuexModule(fixtures.AuthenticationTokenActionsMockWithAuthFailure)

    vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(context)

    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    await loginForm.find(".email input").setValue("user@example.com")
    await loginForm.find(".password input").setValue("password")
    await loginForm.find(".loginButton").trigger("click")

    await waitUntilForDone()

    // 認証処理が呼ばれること
    expect(fixtures.fetchAuthenticationTokenMockWithAuthFailure).toBeCalledTimes(1)

    expect(loginForm.vm.$route.query).toEqual({})
    expect(loginForm.find(".redirectMessage").exists()).toBeFalsy()
  })

  describe("入力欄に入力した値が制約に従わない場合、エラーメッセージが表示される", () => {
    it("メールアドレス欄に空文字が入力された場合、エラーメッセージが表示される", async () => {
      const loginForm = mount(LoginForm, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      await loginForm.find(".email input").setValue("")
      await loginForm.find(".loginButton").trigger("click")

      await waitUntilForDone()

      expect(loginForm.find(".email div[role=\"alert\"] .v-messages__message").text()).not.toBe("")
    })

    it("メールアドレス欄に257文字以上文字が入力された場合、エラーメッセージが表示される", async () => {
      const loginForm = mount(LoginForm, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      await loginForm.find(".email input").setValue("0".repeat(257))
      await loginForm.find(".loginButton").trigger("click")

      await waitUntilForDone()

      expect(loginForm.find(".email div[role=\"alert\"] .v-messages__message").text()).not.toBe("")
    })

    it("パスワード欄に空文字が入力された場合、エラーメッセージが表示される", async () => {
      const loginForm = mount(LoginForm, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      await loginForm.find(".password input").setValue("")
      await loginForm.find(".loginButton").trigger("click")

      await waitUntilForDone()

      expect(loginForm.find(".password div[role=\"alert\"] .v-messages__message").text()).not.toBe("")
    })

    it("パスワード欄に129文字以上文字が入力された場合、エラーメッセージが表示される", async () => {
      const loginForm = mount(LoginForm, {
        localVue,
        vuetify,
        router,
      })

      await waitUntilForMounted()

      await loginForm.find(".password input").setValue("0".repeat(129))
      await loginForm.find(".loginButton").trigger("click")

      await waitUntilForDone()

      expect(loginForm.find(".password div[role=\"alert\"] .v-messages__message").text()).not.toBe("")
    })
  })

  it("入力内容に不備がある場合、ログイン処理は実施されない", async () => {
    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    await loginForm.find(".email input").setValue("")
    await loginForm.find(".password input").setValue("")
    await loginForm.find(".loginButton").trigger("click")

    await waitUntilForDone()

    // 認証処理が呼ばれないこと
    expect(fixtures.fetchAuthenticationTokenMock).not.toBeCalled()

    // タスク管理画面に推移しないこと
    expect(loginForm.vm.$route.path).not.toBe("/tasks")
  })
})
