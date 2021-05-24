import Vuex from "vuex"
import VueRouter from "vue-router"
import { vuexContextContainer } from "@/providers/containers"
import { types } from "@/providers/types"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import { createLocalVue } from "@vue/test-utils"
import { Redirector, RedirectAPI } from "../Redirector"
import { useStderrMock } from "@/shared/testing"
import * as fixtures from "./fixtures/redirector"
import { NotifyClient } from "@/lib/notify/lib"

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)

describe("ユーザーの認証ステータスに応じてリダレクトを行う", () => {
  let router: VueRouter
  let notify: NotifyClient

  beforeEach(() => {
    router = new VueRouter({
      mode: "abstract",
      routes: fixtures.routes
    })

    notify = new fixtures.NotifyClientMock()
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

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStored).toBeCalledTimes(1)
      expect(router.currentRoute.path).toBe("/login")
      expect(isRedirect).toBe(true)
    })

    it("認証トークンが有効で無い場合、リダイレクトが行われる", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithUnAuth).toBeCalledTimes(1)
      expect(router.currentRoute.path).toBe("/login")
      expect(router.currentRoute.query).toEqual({ isRedirect: "true" })
      expect(isRedirect).toBe(true)
    })

    it("認証トークンの有効性の検証に失敗した場合、エラーが通知される", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithException)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const error = useStderrMock()

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.verifyWithException).toBeCalledTimes(1)
      expect(error).toBeCalledTimes(1)
      // エラー出力には空でない文字列が渡される
      expect(error).not.toBeCalledWith("")
      expect(fixtures.fatal).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(router.currentRoute.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("ユーザーが認証済みの場合、リダイレクト処理は行われない", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfUnauthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithAuth).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(router.currentRoute.path).toBe("/")
      expect(isRedirect).toBe(false)
    })
  })

  describe("認証済みユーザーリダイレクト機能", () => {
    it("ユーザーが認証済みの場合、リダイレクト処理が行われる", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithAuth).toBeCalledTimes(1)
      expect(router.currentRoute.path).toBe("/tasks")
      expect(isRedirect).toBe(true)
    })

    it("LocalStorageに認証トークンが保存されていない場合、リダイレクトが行わない", async () => {
      const { context } = fixtures.mockAuthenticationTokenGetters(fixtures.IsStoredStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStored).toBeCalledTimes(1)
      expect(router.currentRoute.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("認証トークンが有効で無い場合、リダイレクトが行われない", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithUnAuth)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.isStoredWithAuth).toBeCalledTimes(1)
      expect(fixtures.verifyWithUnAuth).toBeCalledTimes(1)
      expect(router.currentRoute.path).toBe("/")
      expect(isRedirect).toBe(false)
    })

    it("認証トークンの有効性の検証に失敗した場合、エラーが通知される", async () => {
      const { context } = fixtures.mockAuthenticationToken(fixtures.IsStoredStubWithAuth, fixtures.VerifyStubWithException)

      vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

      const error = useStderrMock()

      const redirector: Redirector = new RedirectAPI(router, notify)

      const isRedirect = await redirector.redirectIfAuthenticated()

      expect(fixtures.verifyWithException).toBeCalledTimes(1)
      expect(error).toBeCalledTimes(1)
      // エラー出力には空でない文字列が渡される
      expect(error).not.toBeCalledWith("")
      expect(fixtures.fatal).toBeCalledTimes(1)
      // リダレクトは行われない
      expect(router.currentRoute.path).toBe("/")
      expect(isRedirect).toBe(false)
    })
  })
})
