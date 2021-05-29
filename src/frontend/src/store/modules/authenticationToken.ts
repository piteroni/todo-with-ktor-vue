import { Credentials } from "@/api/Credentials"
import { Identification } from "@/api/Identification"
import { authenticateTokenConfig } from "@/lib/consts/authenticateTokenConfig"
import { Api } from "@/providers/containers"
import { types } from "@/providers/types"
import {
  Mutations, Getters, Actions, Module
} from "vuex-smart-module"

export interface AuthenticationTokenState {
  token: string;
}

class AuthenticationToken implements AuthenticationTokenState {
  public token = "";
}

export class AuthenticationTokenGetters extends Getters<AuthenticationTokenState> {
  /**
   * 認証トークンが保存されているか取得する.
   *
   * @returns
   *   認証トークンが保存されている場合にtrueを返し、そうでない場合にfalseを返す.
   */
  public get isStored(): boolean {
    return this.state.token !== ""
  }
}

export class AuthenticationTokenMutations extends Mutations<AuthenticationTokenState> {
  /**
   * 認証トークンを保存する.
   */
  public save(token: string): void {
    this.state.token = token
  }
}

export type FetchAuthenticationTokenParameter = {
  email: string;
  password: string;
}

export class AuthenticationTokenActions extends Actions<AuthenticationTokenState, AuthenticationTokenGetters, AuthenticationTokenMutations, AuthenticationTokenActions> {
  @Api(types.api.Identification)
  private $identification!: Identification;

  @Api(types.api.Credentials)
  private $credentials!: Credentials;

  /**
   * 認証トークンの初期化を行う.
   */
  public setUp(): void {
    const token = window.localStorage.getItem(authenticateTokenConfig.storeKey) ?? ""

    this.mutations.save(token)
  }

  /**
   * 認証トークンが有効であるかサーバーに問い合わせ検証する.
   *
   * @throws {UnauthorizedError}
   *   認証トークンが有効で無い場合に送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verify(): Promise<void> {
    await this.$credentials.verify()
  }

  /**
   * ユーザーアカウント情報をサーバーに送信し認証を行い、返された認証トークンを保存する.
   *
   * @param params
   *   サーバーに送信するユーザーアカウント情報.
   * @throws {UnauthorizedError}
   *   認証に失敗した場合に送出される.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async fetch(params: FetchAuthenticationTokenParameter): Promise<void> {
    const { email, password } = params
    const response = await this.$identification.login(email, password)

    this.mutations.save(response.token)
    window.localStorage.setItem(authenticateTokenConfig.storeKey, response.token)
  }

  /**
   * 保存されている認証トークンを削除する.
   */
  public forget(): void {
    window.localStorage.removeItem(authenticateTokenConfig.storeKey)
  }
}

export const authenticationToken = new Module({
  state: AuthenticationToken,
  getters: AuthenticationTokenGetters,
  mutations: AuthenticationTokenMutations,
  actions: AuthenticationTokenActions
})

export type AuthenticationTokenContext = ReturnType<typeof authenticationToken.context>;
