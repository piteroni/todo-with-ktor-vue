export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
    Credentials: Symbol.for("api.Credentials"),
  },
  vuexContext: {
    apiToken: Symbol.for("vuexContext.apiToken"),
  }
} as const
