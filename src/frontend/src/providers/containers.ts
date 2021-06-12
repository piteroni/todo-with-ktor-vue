import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { makeNotImplemented } from "@/providers/lib/shared"

//
// api
//
export const coreContainer = new Container()

coreContainer.bind(types.core.axios).to(makeNotImplemented(`should bind the ${types.core.axios.toString()}`))

coreContainer.bind(types.core.authenticatedAxios).to(makeNotImplemented(`should bind the ${types.core.authenticatedAxios.toString()}`))

export const Core = getDecorators(coreContainer).lazyInject

//
// api
//
export const apiContainer = new Container()

apiContainer.bind(types.api.Credentials).to(makeNotImplemented(`should bind the ${types.api.Credentials.toString()}`))

apiContainer.bind(types.api.Identification).to(makeNotImplemented(`should bind the ${types.api.Identification.toString()}`))

apiContainer.bind(types.api.CurrentUser).to(makeNotImplemented(`should bind the ${types.api.CurrentUser.toString()}`))

export const Api = getDecorators(apiContainer).lazyInject

//
// vuex context
//
export const vuexContextContainer = new Container()

vuexContextContainer.bind(types.vuexContext.authenticationToken).to(makeNotImplemented(`should bind the ${types.vuexContext.authenticationToken.toString()}`))

vuexContextContainer.bind(types.vuexContext.retainedTask).to(makeNotImplemented(`should bind the ${types.vuexContext.retainedTask.toString()}`))

export const VuexContext = getDecorators(vuexContextContainer).lazyInject

//
// service
//
export const serviceContainer = new Container()

serviceContainer.bind(types.service.redirector).to(makeNotImplemented(`should bind the ${types.service.redirector.toString()}`))

export const Service = getDecorators(serviceContainer).lazyInject
