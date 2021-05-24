import { RuntimeError } from "@/shared/exception"
import { injectable } from "inversify"

export class NotImplementedError extends RuntimeError {
}

@injectable()
class TemplateClass {
}

export const makeNotImplemented = (message: string) => {
  return class extends TemplateClass {
    constructor() {
      super()
      throw new NotImplementedError(message)
    }
  }
}
