import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import { types } from "@/providers/types"
import { container as serviceContainer } from "@/providers/containers/service"
import Login from "@/pages/Login/LoginPage.vue"
import * as fixtures from "./fixtures/login"
import { routes } from "./fixtures/shared"
import { Redirector } from "@/lib/middleware/Redirector"
import { waitUntilForMounted } from "@/shared/testing"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(VueRouter)

describe("LoginPage.vue", () => {
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

    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(new fixtures.RedirectorMockWithUnAuth)
  })

  afterEach(() => {
    jest.clearAllMocks()

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

  it("ユーザーが未認証の場合、ログインフォームが表示される", async () => {
    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    expect(fixtures.redirectWithUnAuth).toBeCalledTimes(1)
    expect(login.find("loading-stub").exists()).toBeFalsy()
    expect(login.find("login-form-stub").exists()).toBeTruthy()
  })

  it("ユーザーが認証済みの場合、ログインフォームは表示されない", async () => {
    serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(new fixtures.RedirectorMockWithAuth)

    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    })

    await waitUntilForMounted()

    expect(fixtures.redirectWithAuth).toBeCalledTimes(1)
    expect(login.find("loading-stub").exists()).toBeTruthy()
    expect(login.find("login-form-stub").exists()).toBeFalsy()
  })
})
