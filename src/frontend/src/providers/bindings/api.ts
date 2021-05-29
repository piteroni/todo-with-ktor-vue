import { types } from "@/providers/types"
import { apiContainer } from "@/providers/containers"
import { Identification } from "@/api/Identification"
import { Credentials } from "@/api/Credentials"
import { createAxiosInstance } from "@/api"
import { createBearerSchema } from "@/api/authorization"
import { CurrentUser } from "@/api/implementation/CurrentUser"

apiContainer.rebind<Credentials>(types.api.Credentials).toConstantValue(new Credentials(createAxiosInstance(createBearerSchema())))

apiContainer.rebind(types.api.Identification).toConstantValue(new Identification(createAxiosInstance()))

apiContainer.rebind(types.api.CurrentUser).to(CurrentUser)
