import { Constructor } from "@/lib/testing/lib";
import { RuntimeError } from "@/shared/exception";
import { Actions, createStore, Getters, Module, Mutations } from "vuex-smart-module";

type VuexModule = Module<any, any, any, any, any>

export function mock<T extends VuexModule>(module: T) {
  return new MockBuilder(module.clone())
}

export class VuexMockBuildError extends RuntimeError {
}

class MockBuilder<T extends VuexModule> {
  private moduleKey = ""

  private module: T

  constructor(module: T) {
    this.module = module
  }

  public withKey(key: string): this {
    this.moduleKey = key

    return this
  }

  public withGetters(getters: Constructor<Getters>): this {
    this.module.options.mutations = getters

    return this
  }

  public withMutations(mutations: Constructor<Mutations>): this {
    this.module.options.mutations = mutations

    return this
  }

  public withActions(actions: Constructor<Actions>): this {
    this.module.options.actions = actions

    return this
  }

  public build() {
    if (!this.moduleKey) {
      throw new VuexMockBuildError("module key is not specified")
    }

    const entiries = { [this.moduleKey]: this.module }
    const module = new Module(({ modules: { ...entiries } }))
    const store = createStore(module)
    const context = this.module.context(store)

    return {
      store,
      context
    }
  }
}
