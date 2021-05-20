import { ServerError, UnauthorizedError } from "@/api/exceptions"
import { ApiTokenActions } from "@/store/modules/apiToken"

export const verifyCrediantialsMock = jest.fn()

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  // 認証例外を発生させるようにする
  public async verify(): Promise<void> {
    verifyCrediantialsMock()

    throw new UnauthorizedError("message", 1, "code")
  }
}

export class ApiTokenActionsMockWithAuthed extends ApiTokenActions {
  public setUp(): void {
    this.state.token = "token"
  }

  public async verify(): Promise<void> {
    verifyCrediantialsMock()
  }
}
export class ApiTokenActionsMockWithException extends ApiTokenActions {
  public setUp(): void {
    this.state.token = "token"
  }

  // UnauthorizedError以外を発生させるようにする
  public async verify(): Promise<void> {
    verifyCrediantialsMock()

    throw new ServerError("message")
  }
}
