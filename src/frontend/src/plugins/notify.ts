import Vue, { VueConstructor } from "vue"
import { NotifyApi } from "@/lib/notify/api"
import { bus, TaskEmitter } from "@/lib/notify/lib"

export const notify = new NotifyApi(new TaskEmitter(bus))

Vue.use({
  install(v: VueConstructor<Vue>): void {
    v.prototype.$notify = notify
  }
})
