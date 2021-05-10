import { AxiosInstance } from "axios"
import { injectable } from "inversify"
import { throwApiError } from "@/api/handlers"
import { ApiError, UnauthorizedError } from "@/api/exceptions"
import { HttpStatusCode } from "@/shared/http"
import { createAxiosInstance } from "@/api"
import { createBearerSchema } from "@/api/authorization"

export const resource = "/credentials"

@injectable()
export class Credentials {
  private $api: AxiosInstance

  constructor() {
    this.$api = createAxiosInstance(createBearerSchema())
  }

  /**
   * ユーザーの資格情報を検証する.
   *
   * @throws {UnauthorizedError}
   *   ユーザーの資格情報が有効では無い場合に送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verify(): Promise<void> {
    try {
      await this.$api.post(`${resource}/verify`).catch(throwApiError)
    } catch (e) {
      if (e.constructor.name === ApiError.name) {
        const apiError = e as ApiError

        if (apiError.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(apiError.message, apiError.statusCode, apiError.code)
        }
      }

      throw e
    }
  }
}
