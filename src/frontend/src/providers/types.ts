export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
    Credentials: Symbol.for("api.Credentials"),
  },
  vuexContext: {
    authenticationToken: Symbol.for("vuexContext.authenticationToken"),
  }
} as const
