import Vue from "vue"
import { VueConstructor } from "vue/types/umd"

Vue.use({
  install (v: VueConstructor<Vue>): void {
    /* eslint-disable no-param-reassign */
    v.prototype.$window = window
  },
})
