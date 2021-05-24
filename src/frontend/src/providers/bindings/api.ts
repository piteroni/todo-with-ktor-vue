import { types } from "@/providers/types"
import { apiContainer } from "@/providers/containers"
import { Identification } from "@/api/Identification"
import { Credentials } from "@/api/Credentials"
import { createAxiosInstance } from "@/api"
import { createBearerSchema } from "@/api/authorization"

// createBearerSchemaがvuexContextを参照してしまっているので循環参照になってしまうが
// toDynamicValueを利用することでcreateBearerSchemaが評価されることを遅らせる.
apiContainer.rebind<Credentials>(types.api.Credentials).toDynamicValue(() => {
  return new Credentials(
    createAxiosInstance(createBearerSchema())
  )
})

apiContainer.rebind(types.api.Identification).toDynamicValue(() => {
  return new Identification(
    createAxiosInstance()
  )
})
