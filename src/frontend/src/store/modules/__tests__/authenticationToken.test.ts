import Vuex, { Store } from "vuex"
import { Module, createStore } from "vuex-smart-module"
import { createLocalVue } from "@vue/test-utils"
import {
  authenticationToken, AuthenticationTokenStoreKey, AuthenticationTokenState, AuthenticationTokenContext
} from "@/store/modules/authenticationToken"
import { container } from "@/providers/containers/api"
import { Credentials } from "@/api/Credentials"
import { Identification } from "@/api/Identification"
import { types } from "@/providers/types"
import * as fixtures from "./fixtures/authenticationToken"

const localVue = createLocalVue()

localVue.use(Vuex)

describe("authenticationToken.ts", () => {
  let store: Store<{ authenticationToken: AuthenticationTokenState }>
  let context: AuthenticationTokenContext

  beforeEach(() => {
    store = createStore(new Module({ modules: { authenticationToken: authenticationToken } }))
    context = authenticationToken.context(store)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getters", () => {
    it("stateに認証トークンが保存されているか否かを取得できる", () => {
      context.state.token = "token"

      expect(context.getters.isStored).toBe(true)
    })

    it("stateに認証トークンが保存されていない場合、真偽値falseを返す", () => {
      expect(context.getters.isStored).toBe(false)
    })
  })

  describe("mutations", () => {
    it("stateに認証トークンを保存できる", () => {
      const token = "authenticationToken"
      const expected = "authenticationToken"

      context.mutations.save(token)

      expect(context.state.token).toBe(expected)
      expect(store.state.authenticationToken.token).toBe(expected)
    })
  })

  describe("actions", () => {
    beforeEach(() => {
      container.rebind<Identification>(types.api.Identification).toDynamicValue(() => new fixtures.IdentificationMock())
      container.rebind<Credentials>(types.api.Credentials).toDynamicValue(() => new fixtures.CredentialsMock())
      window.localStorage.clear()
    })

    it("LocalStorageに保存されている認証トークンをstateに設定できる", () => {
      const token = "authenticationToken"
      const expected = "authenticationToken"

      window.localStorage.setItem(AuthenticationTokenStoreKey, token)

      context.actions.setUp()

      expect(context.state.token).toBe(expected)
      expect(store.state.authenticationToken.token).toBe(expected)
    })

    it("LocalStorageに認証トークンが保存されていない場合、stateには空文字が設定される", () => {
      const expected = ""

      context.actions.setUp()

      expect(context.state.token).toBe(expected)
      expect(store.state.authenticationToken.token).toBe(expected)
    })

    it("ユーザーアカウント情報をサーバーに送信し、認証トークンを取得できる", async () => {
      const email = "email-stub"
      const password = "password-stub"

      await context.actions.fetch({ email, password })

      expect(fixtures.loginMock).toBeCalledTimes(1)
      expect(fixtures.loginMock).toBeCalledWith("email-stub", "password-stub")
    })

    it("認証トークンは有効であるか否かを検証できる", async () => {
      context.state.token = "authenticationToken"

      await context.actions.verify()

      expect(fixtures.verifyMock).toBeCalledTimes(1)
    })
  })
})
