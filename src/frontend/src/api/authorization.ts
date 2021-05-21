import { AuthenticationTokenStoreKey } from "@/store/modules/authenticationToken"
import { RuntimeError } from "@/shared/exception"
import { AxiosInstance } from "axios"

export class UnauthorizedError extends RuntimeError {
}

/**
 * Authorization Headerが付与されたAxiosInstanceを表す.
 */
export type AxiosInstanceWithAuthorization = AxiosInstance

export const createBearerSchema = (): Record<string, string> => {
  const token = window.localStorage.getItem(AuthenticationTokenStoreKey)

  if (!token) {
    throw new UnauthorizedError("Unable to obtain an authentication token")
  }

  return {
    "Authorization": `Bearer ${token}`
  }
}
