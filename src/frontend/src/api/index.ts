import axios, { AxiosInstance } from "axios"

const baseURL = ((env: string): string => {
  switch (env) {
    case "development":
      return "http://localhost:8080/api/i/v0"
    case "test":
      return "http://domain.invalid/api/i/v0"
    default:
      throw new Error(`unexpected environment type: ${env}`)
  }
})(process.env.NODE_ENV)

const defaultHeaders = {
  "Content-Type": "application/json"
}

export const createAxiosInstance = (headers: Record<string, string> = {}): AxiosInstance => axios.create({ baseURL,
  headers: {
    ...defaultHeaders,
    ...headers
  } })
