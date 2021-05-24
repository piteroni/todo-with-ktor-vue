import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { makeNotImplemented } from "@/providers/bindings/shared"

//
// api
//
export const apiContainer = new Container()

apiContainer.bind(types.api.Credentials).to(makeNotImplemented(`should bind the ${types.api.Credentials.toString()}`))

apiContainer.bind(types.api.Identification).to(makeNotImplemented(`should bind the ${types.api.Identification.toString()}`))

export const Api = getDecorators(apiContainer).lazyInject

//
// vuex context
//
export const vuexContextContainer = new Container()

vuexContextContainer.bind(types.vuexContext.authenticationToken).to(makeNotImplemented(`should bind the ${types.vuexContext.authenticationToken.toString()}`))

export const VuexContext = getDecorators(vuexContextContainer).lazyInject

//
// service
//
export const serviceContainer = new Container()

serviceContainer.bind(types.service.redirector).to(makeNotImplemented(`should bind the ${types.service.redirector.toString()}`))

export const Service = getDecorators(serviceContainer).lazyInject
