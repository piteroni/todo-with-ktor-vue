export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
    Credentials: Symbol.for("api.Credentials"),
    CurrentUser: Symbol.for("api.CurrentUser"),
  },
  vuexContext: {
    authenticationToken: Symbol.for("vuexContext.authenticationToken"),
    retainedTaskList: Symbol.for("vuexContext.retainedTaskList"),
  },
  service: {
    redirector: Symbol.for("service.redirector"),
  }
} as const
