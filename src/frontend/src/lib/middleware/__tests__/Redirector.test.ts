import Vue from "vue"
import VueRouter from "vue-router"
import { container as vuexContextContainer } from "@/providers/containers/vuexContext"
import { types } from "@/providers/types"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import { Redirector, RedirectAPI } from "../Redirector"
import { useStderrMock } from "@/shared/testing"
import * as fixtures from "./fixtures/redirector"

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("ユーザーの認証ステータスに応じてリダレクトを行う", () => {
  let router: VueRouter
  const StubComponent = Vue.extend({ template: "<div></div>" })

  beforeEach(() => {
    router = new VueRouter({
      mode: "abstract",
      routes: fixtures.routes
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()

    window.localStorage.clear()
  })

  describe("未認証ユーザーリダイレクト機能", () => {
    it("LocalStorageに認証トークンが保存されていない場合、リダイレクトが行われる", async () => {
      const { context } = fixtures.mockAuthenticationTokenGetters(fixtures.IsStoredStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStored).toBeCalledTimes(1)
      expect(wrapper.vm.$route.path).toBe("/login")
      expect(isRedirect).toBe(true)
    })

    it("認証トークンが有効で無い場合、リダイレクトが行われる", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithUnAuth).toBeCalledTimes(1)
      expect(wrapper.vm.$route.path).toBe("/login")
      expect(wrapper.vm.$route.query).toEqual({ isRedirect: "true" })
      expect(isRedirect).toBe(true)
    })

    it("認証トークンの有効性の検証に失敗した場合、エラーが通知される", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithException)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const error = useStderrMock()

      const fatal = jest.fn()

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
        mocks: {
          $notify: {
            fatal
          }
        }
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.verifyWithException).toBeCalledTimes(1)
      expect(error).toBeCalledTimes(1)
      // エラー出力には空でない文字列が渡される
      expect(error).not.toBeCalledWith("")
      expect(fatal).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(wrapper.vm.$route.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("ユーザーが認証済みの場合、リダイレクト処理は行われない", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithAuth).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(wrapper.vm.$route.path).toBe("/")
      expect(isRedirect).toBe(false)
    })
  })

  describe("認証済みユーザーリダイレクト機能", () => {
    it("ユーザーが認証済みの場合、リダイレクト処理が行われる", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithAuth).toBeCalledTimes(1)
      expect(wrapper.vm.$route.path).toBe("/tasks")
      expect(isRedirect).toBe(true)
    })

    it("LocalStorageに認証トークンが保存されていない場合、リダイレクトが行わない", async () => {
      const { context } = fixtures.mockAuthenticationTokenGetters(fixtures.IsStoredStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStored).toBeCalledTimes(1)
      expect(wrapper.vm.$route.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("認証トークンが有効で無い場合、リダイレクトが行われない", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithUnAuth).toBeCalledTimes(1)
      expect(wrapper.vm.$route.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("認証トークンの有効性の検証に失敗した場合、エラーが通知される", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithException)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const error = useStderrMock()

      const fatal = jest.fn()

      const wrapper = shallowMount(StubComponent, {
        localVue,
        router,
        mocks: {
          $notify: {
            fatal
          }
        }
      })

      const redirector: Redirector = new RedirectAPI(wrapper.vm)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.verifyWithException).toBeCalledTimes(1)
      expect(error).toBeCalledTimes(1)
      // エラー出力には空でない文字列が渡される
      expect(error).not.toBeCalledWith("")
      expect(fatal).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(wrapper.vm.$route.path).toBe("/")
      expect(isRedirect).toBe(false)
    })
  })
})
