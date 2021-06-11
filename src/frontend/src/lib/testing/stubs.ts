import { Redirector } from "@/lib/middleware/Redirector"

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class RedirectorStub implements Redirector {
  redirectIfAuthenticated() {
    return Promise.resolve(true)
  }

  redirectIfUnauthenticated() {
    return Promise.resolve(true)
  }
}
