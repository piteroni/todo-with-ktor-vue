export const baseURL = ((env: string): string => {
  switch (env) {
    case "development":
      return "http://localhost:8080/api/i/v0"
    case "test":
      return "http://domain.invalid/api/i/v0"
    default:
      throw new Error(`unexpected environment type: ${env}`)
  }
})(process.env.NODE_ENV)

export const defaultHeaders = {
  "Content-Type": "application/json"
} as const
