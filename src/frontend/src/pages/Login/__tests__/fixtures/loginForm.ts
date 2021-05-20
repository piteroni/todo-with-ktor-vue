import { apiToken, ApiTokenActions, FetchApiTokenParameter } from "@/store/modules/apiToken"
import { UnauthorizedError } from "@/api/exceptions"
import { createStore, Module } from "vuex-smart-module"

export const fetchApiTokenMock = jest.fn()

export class ApiTokenActionsMock extends ApiTokenActions {
  public async fetch(params: FetchApiTokenParameter): Promise<void> {
    fetchApiTokenMock(params)
  }
}

export const fetchApiTokenMockWithAuthFailure = jest.fn()

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  public async fetch(): Promise<void> {
    fetchApiTokenMockWithAuthFailure()

    throw new UnauthorizedError("message", 1, "code")
  }
}

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
