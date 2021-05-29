import { AxiosError } from "axios"
import {
  ApiErrorResponse, ApiError, ClientError, ServerError
} from "@/api/exceptions"
import { StatusCode } from "@/api/lib/shared"

/**
 * APIとの通信時に例外が発生した場合のハンドリングを行う.
 *
 * @param e
 *   例外オブジェクト.
 * @throws {APIError}
 *   サーバーからのレスポンスに有効な情報が含まれていない場合
 *   またはレスポンスに含まれるステータスコードが規定しているもの以外である場合に送出される.
 * @throws {ClientError}
 *   クライエントから送信された値に不備があった場合に送出される.
 * @throws {ServerError}
 *   サーバーで何らかの問題が発生した場合に送出される.
 */
export const throwApiError = (e: AxiosError<ApiErrorResponse>): void => {
  if (typeof e.response === "undefined") {
    throw new ApiError(e.message)
  }

  const statusCode = new StatusCode(e.response.status)

  if (statusCode.isClientError) {
    throw new ClientError(e.response.data.message, e.response.status, e.response.data.code)
  }

  if (statusCode.isServerError) {
    throw new ServerError(e.response.data.message, e.response.status, e.response.data.code)
  }

  throw new ApiError(e.response.data.message, e.response.status, e.response.data.code)
}
