import { types } from "@/providers/types"
import { container } from "@/providers/containers/vuexContext"
import { ApiTokenContext } from "@/store/modules/apiToken"
import { RuntimeError } from "@/shared/exception"

export class UnauthorizedError extends RuntimeError {
}

export const createBearerSchema = (): Record<string, string> => {
  const apiToken = container.get<ApiTokenContext>(types.vuexContext.apiToken)

  if (!apiToken.getters.isApiTokenStored) {
    throw new UnauthorizedError("Unable to obtain an authentication token")
  }

  return { "Authorization": `Bearer ${apiToken.state.token}` }
}
