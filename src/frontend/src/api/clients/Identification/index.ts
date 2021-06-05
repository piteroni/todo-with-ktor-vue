import { injectable } from "inversify"
import { AxiosInstance, AxiosResponse } from "axios"
import { ApiError, UnauthorizedError } from "@/api/lib/exceptions"
import { HttpStatusCode } from "@/shared/http"
import { PostLoginResponse } from "./types"
import { Core } from "@/providers/containers"
import { types } from "@/providers/types"

@injectable()
export class Identification {
  @Core(types.core.axios)
  private $api!: AxiosInstance

  /**
   * ユーザー認証を行う.
   *
   * @param email
   *   ユーザーのメールアドレス.
   * @param password
   *   ユーザーのパスワード.
   * @return
   *   API Token.
   * @throws {UnauthorizedError}
   *   認証に失敗した場合に送出される.
   * @throws {APIError}
   *   APIとの通信に失敗した場合に送出される.
   */
  public async login(email: string, password: string): Promise<PostLoginResponse> {
    const data = { email, password }

    let response: AxiosResponse<PostLoginResponse>

    try {
      response = await this.$api.post("/login", data)
    } catch (e) {
      if (e.constructor.name === ApiError.name) {
        const apiError = e as ApiError

        if (apiError.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(apiError.message, apiError.statusCode, apiError.code)
        }
      }

      throw e
    }

    return response.data
  }
}
