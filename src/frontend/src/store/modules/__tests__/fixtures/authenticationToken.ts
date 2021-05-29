import { Credentials } from "@/api/Credentials"
import { Identification } from "@/api/Identification"
import { PostLoginResponse } from "@/api/Identification/types"

export const loginMock = jest.fn()

export class IdentificationMock extends Identification {
  public async login(email: string, password: string): Promise<PostLoginResponse> {
    loginMock(email, password)

    return {
      token: ""
    }
  }
}

export const verifyMock = jest.fn()

export class CredentialsMock extends Credentials {
  public async verify(): Promise<void> {
    verifyMock()
  }
}
