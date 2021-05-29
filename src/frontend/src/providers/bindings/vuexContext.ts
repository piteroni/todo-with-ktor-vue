import { types } from "@/providers/types"
import { authenticationTokenContext, retainedTaskListContext } from "@/store"
import { vuexContextContainer } from "@/providers/containers"

vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(authenticationTokenContext)
vuexContextContainer.rebind(types.vuexContext.retainedTaskList).toConstantValue(retainedTaskListContext)
