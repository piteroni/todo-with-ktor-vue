import { ServerError, UnauthorizedError } from "@/api/exceptions"
import { AuthenticationTokenActions } from "@/store/modules/authenticationToken"

export const verifyCrediantialsMock = jest.fn()

export class AuthenticationTokenActionsMockWithAuthFailure extends AuthenticationTokenActions {
  // 認証例外を発生させるようにする
  public async verify(): Promise<void> {
    verifyCrediantialsMock()

    throw new UnauthorizedError("message", 1, "code")
  }
}

export class AuthenticationTokenActionsMockWithAuthed extends AuthenticationTokenActions {
  public setUp(): void {
    this.state.token = "token"
  }

  public async verify(): Promise<void> {
    verifyCrediantialsMock()
  }
}

export class AuthenticationTokenActionsMockWithException extends AuthenticationTokenActions {
  public setUp(): void {
    this.state.token = "token"
  }

  // UnauthorizedError以外を発生させるようにする
  public async verify(): Promise<void> {
    verifyCrediantialsMock()

    throw new ServerError("message")
  }
}
