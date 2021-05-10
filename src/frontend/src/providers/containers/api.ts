import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { Identification } from "@/api/Identification"
import { Credentials } from "@/api/Credentials"

export const container = new Container()

container.bind(types.api.Credentials).to(Credentials)
container.bind(types.api.Identification).to(Identification)

const { lazyInject } = getDecorators(container)

export const Api = lazyInject
