import { types } from "@/providers/types"
import { authenticationTokenContext } from "@/store"
import { vuexContextContainer } from "@/providers/containers"

vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(authenticationTokenContext)
