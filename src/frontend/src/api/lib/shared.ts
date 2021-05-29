import { HttpStatusCode } from "@/shared/http"

export class StatusCode {
  private statusCode: number;

  constructor (statusCode: number) {
    this.statusCode = statusCode
  }

  /**
   * リクエストが正常に完了したか取得する.
   */
  get isSuccess (): boolean {
    return (
      this.statusCode === HttpStatusCode.OK ||
        this.statusCode === HttpStatusCode.CREATED ||
        this.statusCode === HttpStatusCode.NO_CONTENT
    )
  }

  /**
   * 不正なリクエストであることを表す
   * NOT_FOUND、FORBIDDENなどの開発者側が意図しないステータスは含めず、ユーザーに通知したいステータスのみを含める.
   */
  get isClientError (): boolean {
    return this.statusCode === HttpStatusCode.UNPROCESSABLE_ENTITY
  }

  /**
   * サーバーでエラーが発生し、リクエストがエラー終了したか取得する.
   */
  get isServerError (): boolean {
    return (
      this.statusCode === HttpStatusCode.INTERNAL_SERVER_ERROR ||
        this.statusCode === HttpStatusCode.BAD_GATEWAY ||
        this.statusCode === HttpStatusCode.SERVICE_UNAVAILABLE ||
        this.statusCode === HttpStatusCode.GATEWAY_TIMEOUT
    )
  }
}
