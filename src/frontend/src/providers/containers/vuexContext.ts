import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { apiTokenContext } from "@/store"

export const container = new Container()

container.bind(types.vuexContext.apiToken).toConstantValue(apiTokenContext)

const { lazyInject } = getDecorators(container)

export const VuexContext = lazyInject
