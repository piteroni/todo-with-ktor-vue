export const types = {
  api: {
    Identification: Symbol.for("api.Identification"),
  },
  vuexContext: {
    apiToken: Symbol.for("vuexContext.apiToken"),
  }
} as const
