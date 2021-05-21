import { AuthenticationTokenActions, FetchAuthenticationTokenParameter } from "@/store/modules/authenticationToken"
import { UnauthorizedError } from "@/api/exceptions"

export const fetchAuthenticationTokenMock = jest.fn()

export class AuthenticationTokenActionsMock extends AuthenticationTokenActions {
  public async fetch(params: FetchAuthenticationTokenParameter): Promise<void> {
    fetchAuthenticationTokenMock(params)
  }
}

export const fetchAuthenticationTokenMockWithAuthFailure = jest.fn()

export class AuthenticationTokenActionsMockWithAuthFailure extends AuthenticationTokenActions {
  public async fetch(): Promise<void> {
    fetchAuthenticationTokenMockWithAuthFailure()

    throw new UnauthorizedError("message", 1, "code")
  }
}

export const fetchWithException = jest.fn()

export class AuthenticationTokenActionsMockWithException extends AuthenticationTokenActions {
  public async fetch(): Promise<void> {
    fetchWithException()

    throw new Error()
  }
}
