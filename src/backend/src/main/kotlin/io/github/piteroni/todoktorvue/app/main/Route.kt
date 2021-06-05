package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.http.controllers.IdentificationController
import io.github.piteroni.todoktorvue.app.http.controllers.TaskController
import io.github.piteroni.todoktorvue.app.persistence.repositories.TaskRepository
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.github.piteroni.todoktorvue.app.usecase.user.UserAccountUseCase
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.routing.route
import io.ktor.routing.get
import io.ktor.routing.post

internal fun Application.applyRoutes() {
    routing {
        internalApiRoutes()
    }
}

internal fun Route.internalApiRoutes() {
    val userAccountUseCase = UserAccountUseCase()
    val taskUseCase = TaskUseCase(TaskRepository())
    val identificationController = IdentificationController(JWT(makeJWTConfig()), userAccountUseCase)
    val taskController = TaskController(taskUseCase)

    route("/api/i/v0") {
        post("/login") {
            identificationController.login(call)
        }

        authenticate {
            route("/credentials") {
                post("/verify") { call.respond(HttpStatusCode.OK) }
            }
        }

        authenticate {
            route("/users/current") {
                get("/tasks") {
                    taskController.getRetainedTaskList(call)
                }
            }
        }
    }
}
