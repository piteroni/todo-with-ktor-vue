import Vue from "vue"
import { types } from "@/providers/types"
import { VuexContext } from "@/providers/containers/vuexContext"
import { UnauthorizedError } from "@/api/exceptions"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import { routeNames } from "@/router/routeNames"
import VueRouter from "vue-router"
import { NotifyClient } from "../notify/lib"

export interface Redirector {
  /**
   * ユーザーが認証されていない場合、特定のページにリダイレクトを行う.
   *
   * @returns
   *   リダイレクトした場合にtrueを返し、そうでない場合にfalseを返す.
   */
  redirectIfUnauthenticated(): Promise<boolean>

  /**
   * ユーザーが認証済みの場合、特定のページにリダイレクトを行う.
   *
   * @return
   *   リダイレクトした場合にtrueを返し、そうでない場合にfalseを返す.
   */
  redirectIfAuthenticated(): Promise<boolean>
}

export class RedirectAPI implements Redirector {
  @VuexContext(types.vuexContext.authenticationToken)
  private $authenticationToken!: AuthenticationTokenContext

  private router: VueRouter

  private notify: NotifyClient

  constructor(router: VueRouter, notify: NotifyClient) {
    this.router = router
    this.notify = notify
  }

  public async redirectIfAuthenticated(): Promise<boolean> {
    await this.$authenticationToken.actions.setUp()

    if (!this.$authenticationToken.getters.isStored) {
      return false
    }

    try {
      await this.$authenticationToken.actions.verify()
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return false
      }

      console.error(e)
      this.notify.fatal()

      return false
    }

    this.router.push({ name: routeNames.manageTask })

    return true
  }

  public async redirectIfUnauthenticated(): Promise<boolean> {
    await this.$authenticationToken.actions.setUp()

    if (!this.$authenticationToken.getters.isStored) {
      this.router.push({ name: routeNames.login })
      return true
    }

    try {
      await this.$authenticationToken.actions.verify()
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        this.router.push({ name: routeNames.login, query: { isRedirect: "true" } })
        return true
      }

      console.error(e)
      this.notify.fatal()

      return false
    }

    return false
  }
}
