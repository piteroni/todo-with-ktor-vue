
import Vue from "vue"
import Vuex, { Store } from "vuex"
import { createStore, Module } from "vuex-smart-module"

import { apiToken, ApiTokenState } from "@/store/modules/apiToken"

Vue.use(Vuex)

export type StoreType = Store<{
  apiToken: ApiTokenState;
}>;

export const store: StoreType = createStore(
  new Module({
    modules: {
      apiToken
    }
  })
)

export const apiTokenContext = apiToken.context(store)
