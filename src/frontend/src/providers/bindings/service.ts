import { router } from "@/router"
import { RedirectAPI, Redirector } from "@/lib/middleware/Redirector"
import { notify } from "@/plugins/notify"
import { container } from "@/providers/containers/service"
import { types } from "@/providers/types"

container.rebind<Redirector>(types.service.redirector).toDynamicValue(() => {
  return new RedirectAPI(router, notify)
})
