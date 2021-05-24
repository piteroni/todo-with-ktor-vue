import Vue from "vue"
import App from "@/App.vue"
import { router } from "@/router"
import { store } from "@/store"
import vuetify from "@/plugins/vuetify"
import "@/providers/bindings/service"
import "@/plugins/window"
import "@/plugins/notify"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app")
