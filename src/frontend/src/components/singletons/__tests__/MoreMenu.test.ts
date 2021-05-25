import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"
import Vuetify from "vuetify"
import { createLocalVue, mount } from "@vue/test-utils"
import { types } from "@/providers/types"
import { vuexContextContainer } from "@/providers/containers"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import MoreMenu from "@/components/singletons/MoreMenu.vue"
import * as fixtures from "./fixtures/moreMenu"
import { appendVApp } from "@/shared/vuetify"

Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)

describe("MoreMenu.vue", () => {
  let router: VueRouter
  let vuetify: Vuetify

  beforeAll(() => {
    appendVApp()
  })

  beforeEach(() => {
    vuetify = new Vuetify()

    router = new VueRouter({
      mode: "abstract",
      routes: fixtures.routes
    })
  })

  afterEach(() => {
    jest.clearAllMocks()

    window.localStorage.clear()
  })

  it("ログアウトボタンを押下すると、ログアウト処理が行われる", async () => {
    const { context } = fixtures.setUpAuthenticationTokenWithActions(fixtures.ForgetMock)

    vuexContextContainer.rebind<AuthenticationTokenContext>(types.vuexContext.authenticationToken).toConstantValue(context)

    const moreMenu = mount(MoreMenu, {
      localVue,
      router,
      vuetify,
    })

    await moreMenu.find(".menuButton").trigger("click")
    await moreMenu.find(".logoutButton").trigger("click")

    expect(fixtures.forget).toBeCalledTimes(1)
    expect(moreMenu.vm.$route.path).toBe("/login")
  })
})
