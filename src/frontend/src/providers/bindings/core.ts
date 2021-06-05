import { AxiosInstance } from "axios"
import { types } from "@/providers/types"
import { coreContainer } from "@/providers/containers"
import { AxiosInstanceFactory } from "@/api/lib/core"

coreContainer.rebind<AxiosInstance>(types.core.axios).toConstantValue(AxiosInstanceFactory.get())
coreContainer.rebind<AxiosInstance>(types.core.authenticatedAxios).toDynamicValue(() => {
  return AxiosInstanceFactory.auth()
})
