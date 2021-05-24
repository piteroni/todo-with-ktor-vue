import "reflect-metadata"
import Vue from "vue"
import { Container } from "inversify"
import getDecorators from "inversify-inject-decorators"
import { types } from "@/providers/types"
import { Redirector ,RedirectAPI } from "@/lib/middleware/Redirector"

export const container = new Container()

container.bind<Redirector>(types.service.redirector).toDynamicValue(() => {
  return new RedirectAPI(new Vue())
})

const { lazyInject } = getDecorators(container)

export const Service = lazyInject
