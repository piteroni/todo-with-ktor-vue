import Vue, { VueConstructor } from "vue"
import { NotifyApi } from "@/lib/notify/api"
import { bus, TaskEmitter } from "@/lib/notify/lib"

Vue.use({
  install(v: VueConstructor<Vue>): void {
    v.prototype.$notify = new NotifyApi(new TaskEmitter(bus))
  }
})
