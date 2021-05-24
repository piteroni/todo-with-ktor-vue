import { UnauthorizedError } from "@/api/exceptions";
import { authenticationToken, AuthenticationTokenActions, AuthenticationTokenGetters } from "@/store/modules/authenticationToken";
import { RouteConfig } from "vue-router";
import { createStore, Module } from "vuex-smart-module";

export const routes: RouteConfig[] = [
  { path: "/login", name: "login", component: { template: "<div><b>stub</b></div>" } },
  { path: "/tasks", name: "manageTask", component: { template: "<div><b>stub</b></div>" } }
]

export const isStored = jest.fn()

export class IsStoredStubWithUnAuth extends AuthenticationTokenGetters {
  public get isStored(): boolean {
    isStored()
    return false
  }
}

export const isStoredWithAuth = jest.fn()

export class IsStoredStubWithAuth extends AuthenticationTokenGetters {
  public get isStored(): boolean {
    isStoredWithAuth()
    return true
  }
}

export const verifyWithUnAuth = jest.fn()

export class VerifyStubWithUnAuth extends AuthenticationTokenActions {
  public async verify(): Promise<void> {
    verifyWithUnAuth()
    throw new UnauthorizedError("11")
  }
}

export const verifyWithException = jest.fn()

export class VerifyStubWithException extends AuthenticationTokenActions {
  public async verify(): Promise<void> {
    verifyWithException()
    throw new Error
  }
}

export const verifyWithAuth = jest.fn()

export class VerifyStubWithAuth extends AuthenticationTokenActions {
  public async verify(): Promise<void> {
    verifyWithAuth()
  }
}

export const mockAuthenticationToken = (getters: typeof AuthenticationTokenGetters, actions: typeof AuthenticationTokenActions) => {
  const authenticationTokenClone = authenticationToken.clone()

  authenticationTokenClone.options.getters = getters
  authenticationTokenClone.options.actions = actions

  return make(authenticationTokenClone)
}

export const mockAuthenticationTokenGetters = (getters: typeof AuthenticationTokenGetters) => {
  const authenticationTokenClone = authenticationToken.clone()

  authenticationTokenClone.options.getters = getters

  return make(authenticationTokenClone)
}

export const mockAuthenticationTokenActions = (actions: typeof AuthenticationTokenActions) => {
  const authenticationTokenClone = authenticationToken.clone()

  authenticationTokenClone.options.actions = actions

  return make(authenticationTokenClone)
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const make = (module: typeof authenticationToken) => {
  const store = createStore(new Module({ modules: { authenticationToken: module } }))

  const context = module.context(store)

  return {
    store,
    context
  }
}
