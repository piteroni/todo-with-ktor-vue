import { router } from "@/router"
import { RedirectAPI, Redirector } from "@/lib/middleware/Redirector"
import { notify } from "@/plugins/notify"
import { serviceContainer } from "@/providers/containers"
import { types } from "@/providers/types"

serviceContainer.rebind<Redirector>(types.service.redirector).toConstantValue(new RedirectAPI(router, notify))
