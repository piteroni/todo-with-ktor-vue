import Vuex, { Store } from "vuex"
import { Module, createStore } from "vuex-smart-module"
import { createLocalVue } from "@vue/test-utils"
import {
  authenticationToken, AuthenticationTokenState, AuthenticationTokenContext
} from "@/store/modules/authenticationToken"
import { apiContainer } from "@/providers/containers"
import { Credentials } from "@/api/clients/Credentials"
import { authenticateTokenConfig } from "@/lib/consts/authenticateTokenConfig"
import { Identification } from "@/api/clients/Identification"
import { types } from "@/providers/types"
import { createMock } from "@/lib/testing/lib"

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
    const loginMock = jest.fn()
    const verifyMock = jest.fn()

    beforeAll(() => {
      const identificationMock = createMock(Identification, {
        async login(email: string, password: string) {
          loginMock(email, password)

          return {
            token: ""
          }
        }
      })

      const credentialsMock = createMock(Credentials, {
        async verify() {
          verifyMock()
        }
      })

      apiContainer.rebind<Identification>(types.api.Identification).toConstantValue(identificationMock)
      apiContainer.rebind<Credentials>(types.api.Credentials).toConstantValue(credentialsMock)
    })

    beforeEach(() => {
      window.localStorage.clear()
    })

    it("LocalStorageに保存されている認証トークンをstateに設定できる", () => {
      const token = "authenticationToken"
      const expected = "authenticationToken"

      window.localStorage.setItem(authenticateTokenConfig.storeKey, token)

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

      expect(loginMock).toBeCalledTimes(1)
      expect(loginMock).toBeCalledWith("email-stub", "password-stub")
    })

    it("認証トークンは有効であるか否かを検証できる", async () => {
      context.state.token = "authenticationToken"

      await context.actions.verify()

      expect(verifyMock).toBeCalledTimes(1)
    })

    it("保存されている認証トークンを削除できる", async () => {
      window.localStorage.setItem(authenticateTokenConfig.storeKey, "authenticationToken")

      await context.actions.forget()

      const actual = window.localStorage.getItem(authenticateTokenConfig.storeKey)

      expect(actual).toBe(null)
    })
  })
})
