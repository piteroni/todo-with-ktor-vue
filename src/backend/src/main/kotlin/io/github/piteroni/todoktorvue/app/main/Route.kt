package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.http.controllers.IdentificationController
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.http.HttpStatusCode
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

internal fun Route.internalApiRoutes() {
    val identificationController = IdentificationController()

    route("/api/i/v0") {
        post("/login") {
            identificationController.login(call)
        }

        authenticate {
            get("ping") {
                call.respond(call.principal<UserIdPrincipal>()!!)
            }

            route("/credentials") {
                post("/verify") { call.respond(HttpStatusCode.OK) }
            }
        }
    }
}
