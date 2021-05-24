import { types } from "@/providers/types"
import { authenticationTokenContext } from "@/store"
import { vuexContextContainer } from "../containers"

vuexContextContainer.rebind(types.vuexContext.authenticationToken).toConstantValue(authenticationTokenContext)
