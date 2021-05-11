import { Notify } from "@/lib/notify/types"

declare module "vue/types/vue" {
  interface Vue {
    $notify: Notify;
  }
}
