import { Redirector } from "@/lib/middleware/Redirector"

export class RedirectorStub implements Redirector {
  redirectIfAuthenticated() {
    return Promise.resolve(true)
  }

  redirectIfUnauthenticated() {
    return Promise.resolve(true)
  }
}
