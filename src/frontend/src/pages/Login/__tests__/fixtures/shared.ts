import { RouteConfig } from "vue-router"
import { apiToken, ApiTokenActions } from "@/store/modules/apiToken"
import { createStore, Module } from "vuex-smart-module"

export const routes: Array<RouteConfig> = [
  {
    path: "/tasks",
    name: "manageTask",
    component: { template: "<div></div>" }
  }
]

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setUpVuexModule = (actions: typeof ApiTokenActions) => {
  const apiTokenClone = apiToken.clone()

  apiTokenClone.options.actions = actions

  const store = createStore(new Module({ modules: { apiToken: apiTokenClone } }))

  const context = apiTokenClone.context(store)

  return {
    store,
    context
  }
}
