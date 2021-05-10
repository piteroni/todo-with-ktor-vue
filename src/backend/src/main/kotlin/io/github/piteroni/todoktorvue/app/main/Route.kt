package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.http.controllers.IdentificationController
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.response.*
import io.ktor.routing.*

internal fun Application.applyRoutes() {
    routing {
        internalApiRoutes()
    }
}

val identificationController = IdentificationController()

internal fun Route.internalApiRoutes() {
    route("/api/i/v0") {
        post("/login") {
            identificationController.login(call)
        }

        authenticate {
            get("ping") {
                call.respond(call.principal<UserIdPrincipal>()!!)
            }
        }
    }
}
