import Vue from "vue"
import Vuex, { Store } from "vuex"
import { createStore, Module } from "vuex-smart-module"
import { authenticationToken, AuthenticationTokenState } from "@/store/modules/authenticationToken"

Vue.use(Vuex)

export type StoreType = Store<{
  authenticationToken: AuthenticationTokenState;
}>;

export const store: StoreType = createStore(
  new Module({
    modules: {
      authenticationToken
    }
  })
)

export const authenticationTokenContext = authenticationToken.context(store)
