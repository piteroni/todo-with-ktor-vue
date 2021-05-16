import { NotifyClient } from "@/lib/notify/lib"

declare module "vue/types/vue" {
  interface Vue {
    $notify: NotifyClient;
    $window: Window;
  }
}
