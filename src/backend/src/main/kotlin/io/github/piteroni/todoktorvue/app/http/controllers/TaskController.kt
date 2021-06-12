package io.github.piteroni.todoktorvue.app.http.controllers

import io.github.piteroni.todoktorvue.app.usecase.task.AuthorizationException
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.http.exceptions.BadRequestException
import io.github.piteroni.todoktorvue.app.http.exceptions.ForbiddenException
import io.ktor.application.ApplicationCall
import io.ktor.auth.principal
import io.ktor.http.HttpStatusCode
import io.ktor.request.uri
import io.ktor.request.httpMethod
import io.ktor.response.respond

class TaskController(private val taskUseCase: TaskUseCase) {
    suspend fun getRetainedTaskList(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!

        val retainedTaskList = taskUseCase.getRetainedTaskList(userId.value)

        call.respond(HttpStatusCode.OK, retainedTaskList)
    }

    suspend fun deleteRetainedTask(call: ApplicationCall, param: String?) {
        val userId = call.principal<UserIdPrincipal>()!!

        val taskId = param?.toIntOrNull() ?: throw BadRequestException(call.request.uri, call.request.httpMethod.value, "path parameter is not an integer. param = $param")

        try {
            taskUseCase.deleteRetainedTask(userId.value, taskId)
        } catch (exception: AuthorizationException) {
            throw ForbiddenException(call.request.uri, call.request.httpMethod.value, exception)
        }

        call.respond(HttpStatusCode.NoContent)
    }
}