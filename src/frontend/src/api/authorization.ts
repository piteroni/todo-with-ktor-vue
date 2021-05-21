import { apiTokenKey } from "@/store/modules/apiToken"
import { RuntimeError } from "@/shared/exception"

export class UnauthorizedError extends RuntimeError {
}

export const createBearerSchema = (): Record<string, string> => {
  const token = window.localStorage.getItem(apiTokenKey)

  if (!token) {
    throw new UnauthorizedError("Unable to obtain an authentication token")
  }

  return {
    "Authorization": `Bearer ${token}`
  }
}
