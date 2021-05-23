package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.http.controllers.IdentificationController
import io.github.piteroni.todoktorvue.app.usecase.user.UserAccountUseCase
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.routing.routing

internal fun Application.applyRoutes() {
    routing {
        internalApiRoutes()
    }
}

internal fun Route.internalApiRoutes() {
    val jwt = JWT(makeJWTConfig())
    val userAccountUseCase = UserAccountUseCase()
    val identificationController = IdentificationController(jwt, userAccountUseCase)

    route("/api/i/v0") {
        post("/login") {
            identificationController.login(call)
        }

        authenticate {
            route("/credentials") {
                post("/verify") { call.respond(HttpStatusCode.OK) }
            }
        }
    }
}
