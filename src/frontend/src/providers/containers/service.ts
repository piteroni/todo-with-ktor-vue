import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { makeNotImplemented } from "@/providers/bindings/shared"

export const container = new Container()

container.bind(types.service.redirector).to(makeNotImplemented(`should bind the ${types.service.redirector.toString()}`))

const { lazyInject } = getDecorators(container)

export const Service = lazyInject
