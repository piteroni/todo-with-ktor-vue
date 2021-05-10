import { Credentials } from "@/api/Credentials"
import { Identification } from "@/api/Identification"
import { Api } from "@/providers/containers/api"
import { types } from "@/providers/types"
import {
  Mutations, Getters, Actions, Module
} from "vuex-smart-module"

export const apiTokenKey = "api-token" as const

export interface ApiTokenState {
  token: string;
}

class ApiToken implements ApiTokenState {
  public token = "";
}

export class ApiTokenGetters extends Getters<ApiTokenState> {
  /**
   * API Tokenが保存されているか取得する.
   *
   * @returns API Tokenが保存されているか.
   */
  public get isStored(): boolean {
    return this.state.token !== ""
  }
}

export class ApiTokenMutations extends Mutations<ApiTokenState> {
  /**
   * APIトークンを保存する.
   *
   * @param token APIトークン.
   */
  public save(token: string): void {
    this.state.token = token
  }
}

export type FetchApiTokenParameter = {
  email: string;
  password: string;
}

export class ApiTokenActions extends Actions<ApiTokenState, ApiTokenGetters, ApiTokenMutations, ApiTokenActions> {
  @Api(types.api.Identification)
  private $identification!: Identification;

  @Api(types.api.Credentials)
  private $credentials!: Credentials;

  /**
   * API Tokenの初期化処理を行う.
   */
  public setUp(): void {
    const token = window.localStorage.getItem(apiTokenKey) ?? ""

    this.mutations.save(token)
  }

  /**
   * API Tokenが有効かサーバーに問い合わせ検証する.
   *
   * @throws {UnauthorizedError}
   *   ログインユーザーの資格情報が有効では無い場合に送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verify(): Promise<void> {
    await this.$credentials.verify()
  }

  /**
   * 認証APIにリクエストを発行し、返されたAPI Tokenをローカルに保存する.
   *
   * @param params
   *   APIに送信する認証パラメーター.
   * @throws {UnauthorizedError}
   *   認証に失敗した場合に送出される.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async fetch(params: FetchApiTokenParameter): Promise<void> {
    const { email, password } = params
    const response = await this.$identification.login(email, password)

    window.localStorage.setItem(apiTokenKey, response.token ?? "")
    this.mutations.save(response.token)
  }
}

export const apiToken = new Module({
  state: ApiToken,
  getters: ApiTokenGetters,
  mutations: ApiTokenMutations,
  actions: ApiTokenActions
})

export type ApiTokenContext = ReturnType<typeof apiToken.context>;
