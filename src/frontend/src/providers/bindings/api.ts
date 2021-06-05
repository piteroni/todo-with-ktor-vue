import { types } from "@/providers/types"
import { apiContainer } from "@/providers/containers"
import { Identification } from "@/api/clients/Identification"
import { Credentials } from "@/api/clients/Credentials"
import { CurrentUser } from "@/api/clients/CurrentUser"

apiContainer.rebind(types.api.Credentials).to(Credentials)
apiContainer.rebind(types.api.Credentials).to(Credentials)
apiContainer.rebind(types.api.Identification).to(Identification)
apiContainer.rebind(types.api.CurrentUser).to(CurrentUser)
