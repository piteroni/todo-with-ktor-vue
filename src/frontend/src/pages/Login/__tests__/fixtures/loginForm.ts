import { ApiTokenActions, FetchApiTokenParameter } from "@/store/modules/apiToken"
import { UnauthorizedError } from "@/api/exceptions"

export const fetchApiTokenMock = jest.fn()

export class ApiTokenActionsMock extends ApiTokenActions {
  public async fetch(params: FetchApiTokenParameter): Promise<void> {
    fetchApiTokenMock(params)
  }
}

export const fetchApiTokenMockWithAuthFailure = jest.fn()

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  public async fetch(): Promise<void> {
    fetchApiTokenMockWithAuthFailure()

    throw new UnauthorizedError("message", 1, "code")
  }
}
