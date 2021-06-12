import Vue from "vue"
import Vuex, { Store } from "vuex"
import { createStore, Module } from "vuex-smart-module"
import { authenticationToken, AuthenticationTokenState } from "@/store/modules/authenticationToken"
import { retainedTask, RetainedTaskState } from "@/store/modules/retainedTask"

Vue.use(Vuex)

export type StoreType = Store<{
  authenticationToken: AuthenticationTokenState,
  retainedTask: RetainedTaskState
}>;

export const store: StoreType = createStore(
  new Module({
    modules: {
      authenticationToken,
      retainedTask
    }
  })
)

export const authenticationTokenContext = authenticationToken.context(store)
export const retainedTaskContext = retainedTask.context(store)
