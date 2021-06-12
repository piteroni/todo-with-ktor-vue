export const types = {
  core: {
    axios: Symbol.for("api.core.axios"),
    authenticatedAxios: Symbol.for("api.core.AuthenticatedAxios")
  },
  api: {
    Identification: Symbol.for("api.Identification"),
    Credentials: Symbol.for("api.Credentials"),
    CurrentUser: Symbol.for("api.CurrentUser"),
  },
  vuexContext: {
    authenticationToken: Symbol.for("vuexContext.authenticationToken"),
    retainedTask: Symbol.for("vuexContext.retainedTask"),
  },
  service: {
    redirector: Symbol.for("service.redirector"),
  }
} as const
