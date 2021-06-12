import { types } from "@/providers/types"
import { authenticationTokenContext, retainedTaskContext } from "@/store"
import { vuexContextContainer } from "@/providers/containers"

vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(authenticationTokenContext)
vuexContextContainer.rebind(types.vuexContext.retainedTask).toConstantValue(retainedTaskContext)
