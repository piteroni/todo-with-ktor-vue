import Vue from "vue"
import Vuex, { Store } from "vuex"
import { createStore, Module } from "vuex-smart-module"
import { authenticationToken, AuthenticationTokenState } from "@/store/modules/authenticationToken"
import { retainedTaskList, RetainedTaskListState } from "@/store/modules/retainedTaskList"

Vue.use(Vuex)

export type StoreType = Store<{
  authenticationToken: AuthenticationTokenState,
  retainedTaskList: RetainedTaskListState
}>;

export const store: StoreType = createStore(
  new Module({
    modules: {
      authenticationToken,
      retainedTaskList
    }
  })
)

export const authenticationTokenContext = authenticationToken.context(store)
export const retainedTaskListContext = retainedTaskList.context(store)
