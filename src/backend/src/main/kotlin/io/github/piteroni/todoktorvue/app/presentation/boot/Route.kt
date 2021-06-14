package io.github.piteroni.todoktorvue.app.presentation.boot

import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.github.piteroni.todoktorvue.app.usecase.user.UserUseCase
import io.github.piteroni.todoktorvue.app.presentation.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.presentation.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.presentation.controllers.IdentificationController
import io.github.piteroni.todoktorvue.app.presentation.controllers.TaskController
import io.github.piteroni.todoktorvue.app.infrastructure.repositories.TaskRepository
import io.github.piteroni.todoktorvue.app.infrastructure.repositories.UserRepository
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
import io.ktor.routing.delete

internal fun Application.applyRoutes() {
    routing {
        internalApiRoutes()
    }
}

internal fun Route.internalApiRoutes() {
    val userUseCase = UserUseCase(UserRepository())
    val taskUseCase = TaskUseCase(TaskRepository())
    val identificationController = IdentificationController(JWT(makeJWTConfig()), userUseCase)
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
                route("tasks") {
                    get {
                        taskController.getRetainedTaskList(call)
                    }

                    post {
                        taskController.createRetainedTask(call)
                    }

                    delete("/{taskId}") {
                        taskController.deleteRetainedTask(call, call.parameters["taskId"])
                    }
                }
            }
        }
    }
}
