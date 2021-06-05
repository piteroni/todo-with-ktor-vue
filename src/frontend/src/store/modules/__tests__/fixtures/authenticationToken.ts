import { Credentials } from "@/api/clients/Credentials"
import { Identification } from "@/api/clients/Identification"
import { PostLoginResponse } from "@/api/clients/Identification/types"

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
