import { RouteConfig } from "vue-router"
import { authenticationToken, AuthenticationTokenActions } from "@/store/modules/authenticationToken"
import { createStore, Module } from "vuex-smart-module"

export const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: { template: "<div></div>" }
  }
]

export const forget = jest.fn()

export class ForgetMock extends AuthenticationTokenActions {
  forget() {
    forget()
  }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setUpAuthenticationTokenWithActions = (actions: typeof AuthenticationTokenActions) => {
  const authenticationTokenClone = authenticationToken.clone()

  authenticationTokenClone.options.actions = actions

  const store = createStore(new Module({ modules: { authenticationToken: authenticationTokenClone } }))

  const context = authenticationTokenClone.context(store)

  return {
    store,
    context
  }
}
