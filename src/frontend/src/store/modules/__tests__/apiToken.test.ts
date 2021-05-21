import Vuex, { Store } from "vuex"
import { Module, createStore } from "vuex-smart-module"
import { createLocalVue } from "@vue/test-utils"
import {
  apiToken, apiTokenKey, ApiTokenState, ApiTokenContext
} from "@/store/modules/apiToken"
import { container } from "@/providers/containers/api"
import { Identification } from "@/api/Identification"
import { types } from "@/providers/types"
import * as fixtures from "./fixtures/apiToken"
import { Credentials } from "@/api/Credentials"

const localVue = createLocalVue()

localVue.use(Vuex)

describe("apiToken.ts", () => {
  let store: Store<{ apiToken: ApiTokenState }>
  let context: ApiTokenContext

  beforeEach(() => {
    store = createStore(new Module({ modules: { apiToken } }))
    context = apiToken.context(store)
  })

  describe("getters", () => {
    it("stateにAPIトークンが保存されているか否かを取得できる", () => {
      context.state.token = "token"

      expect(context.getters.isStored).toBe(true)
    })

    it("stateにAPIトークンが保存されていない場合、真偽値falseを返す", () => {
      expect(context.getters.isStored).toBe(false)
    })
  })

  describe("mutations", () => {
    it("stateにAPIトークンを保存できる", () => {
      const token = "apitoken"

      context.mutations.save(token)

      expect(context.state.token).toBe("apitoken")
      expect(store.state.apiToken.token).toBe("apitoken")
    })
  })

  describe("actions", () => {
    beforeEach(() => {
      container.rebind<Identification>(types.api.Identification).to(fixtures.IdentificationMock)
      container.rebind<Credentials>(types.api.Credentials).to(fixtures.CredentialsMock)
      window.localStorage.clear()
    })

    it("LocalStorageに保存したAPIトークンをstateに設定できる", () => {
      const token = "apitoken"
      const expected = "apitoken"

      window.localStorage.setItem(apiTokenKey, token)

      context.actions.setUp()

      expect(context.state.token).toBe(expected)
      expect(store.state.apiToken.token).toBe(expected)
    })
  })
})
