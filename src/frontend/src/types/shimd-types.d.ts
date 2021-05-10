
import { Notify } from "@/plugins/notify/types"

declare module "vue/types/vue" {
  interface Vue {
    $notify: Notify;
  }
}
