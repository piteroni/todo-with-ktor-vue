import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import { routeNames } from "./routeNames"
import Login from "@/pages/Login/LoginPage.vue"
import ManageTask from "@/pages/ManageTask/ManageTaskPage.vue"
import NotFound from "@/pages/Error/NotFound.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: routeNames.login,
    component: Login,
  },
  {
    path: "/tasks",
    name: routeNames.manageTask,
    component: ManageTask,
  },
  {
    path: "*",
    name: routeNames.notFound,
    component: NotFound,
  },
]

export const router = new VueRouter({
  mode: "history",
  routes,
})
