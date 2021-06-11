import { Redirector } from "@/lib/middleware/Redirector";

export const redirectIfUnauthenticatedMock = jest.fn()

export class RedirectorMock implements Redirector {
  redirectIfUnauthenticated() {
    redirectIfUnauthenticatedMock()
    return Promise.resolve(true)
  }

  redirectIfAuthenticated() {
    return Promise.resolve(true)
  }
}
