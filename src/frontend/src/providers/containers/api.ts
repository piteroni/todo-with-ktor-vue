import "reflect-metadata"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { Identification } from "@/api/Identification"
import { Credentials } from "@/api/Credentials"
import { createAxiosInstance } from "@/api"
import { createBearerSchema } from "@/api/authorization"

export const container = new Container()

container.bind<Credentials>(types.api.Credentials).toDynamicValue(() => {
  return new Credentials(
    createAxiosInstance(createBearerSchema())
  )
})
container.bind(types.api.Identification).toDynamicValue(() => {
  return new Identification(
    createAxiosInstance()
  )
})

const { lazyInject } = getDecorators(container)

export const Api = lazyInject
