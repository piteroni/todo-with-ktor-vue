import axios, { AxiosInstance } from "axios"
import { baseURL, defaultHeaders } from "@/api/lib/config"
import { authenticateTokenConfig } from "@/lib/consts/authenticateTokenConfig"
import { throwApiError } from "@/api/lib/handlers"
import { RuntimeError } from "@/shared/exception"

class TokenNotExistsError extends RuntimeError {}

export class AxiosInstanceFactory {
  /**
   * 生成したAxiosInstanceを取得する.
   */
  public static get(): AxiosInstance {
    return this.make()
  }

  /**
   * Authorization Headerが付与されたAxiosInstanceを取得する.
   *
   * @throws {@/api/lib/client#TokenNotExistsError}
   *   LocalStorageに認証トークンが保存されていない場合に送出される.
   */
  public static auth(): AxiosInstance {
    const api = this.make()

    const token = window.localStorage.getItem(authenticateTokenConfig.storeKey)

    if (!token) {
      throw new TokenNotExistsError("認証トークンを永続化領域に保存してください")
    }

    api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`

      return config
    })

    return api
  }

  private static make(): AxiosInstance {
    const api = axios.create({
      baseURL: baseURL,
      headers: { ...defaultHeaders },
    })

    api.interceptors.response.use(response => response, error => throwApiError(error))

    return api
  }
}
