import { Redirector } from "@/lib/middleware/Redirector";

export const redirectWithUnAuth = jest.fn()

export class RedirectorMockWithUnAuth implements Redirector {
  async redirectIfAuthenticated() {
    redirectWithUnAuth()
    return false
  }

  // stub
  async redirectIfUnauthenticated() {
    return true
  }
}

export const redirectWithAuth = jest.fn()

export class RedirectorMockWithAuth implements Redirector {
  async redirectIfAuthenticated() {
    redirectWithAuth()
    return true
  }

  // stub
  async redirectIfUnauthenticated() {
    return true
  }
}
