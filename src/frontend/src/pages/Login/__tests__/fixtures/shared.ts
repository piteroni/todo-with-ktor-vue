import { RouteConfig } from "vue-router"
import { createStore, Module } from "vuex-smart-module"
import { authenticationToken, AuthenticationTokenActions } from "@/store/modules/authenticationToken"

export const routes: Array<RouteConfig> = [
  {
    path: "/tasks",
    name: "manageTask",
    component: { template: "<div></div>" }
  }
]

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setUpVuexModule = (actions: typeof AuthenticationTokenActions) => {
  const authenticationTokenClone = authenticationToken.clone()

  authenticationTokenClone.options.actions = actions

  const store = createStore(new Module({ modules: { authenticationToken: authenticationTokenClone } }))

  const context = authenticationTokenClone.context(store)

  return {
    store,
    context
  }
}
