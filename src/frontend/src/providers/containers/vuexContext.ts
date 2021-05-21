import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { authenticationTokenContext } from "@/store"

export const container = new Container()

container.bind(types.vuexContext.authenticationToken).toConstantValue(authenticationTokenContext)

const { lazyInject } = getDecorators(container)

export const VuexContext = lazyInject
