package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.http.controllers.IdentificationController
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.routing.routing

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
