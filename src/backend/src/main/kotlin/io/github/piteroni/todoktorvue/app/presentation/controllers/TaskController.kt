package io.github.piteroni.todoktorvue.app.presentation.controllers

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.presentation.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.presentation.exceptions.BadRequestException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.ForbiddenException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.UnprocessableEntityException
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RequestValidationException
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RetainedTaskCreateRequest
import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.RetainedTaskCreateResponse
import io.github.piteroni.todoktorvue.app.usecase.task.AuthorizationException
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.ktor.application.ApplicationCall
import io.ktor.auth.principal
import io.ktor.http.HttpStatusCode
import io.ktor.request.httpMethod
import io.ktor.request.receive
import io.ktor.request.uri
import io.ktor.response.respond

class TaskController(private val taskUseCase: TaskUseCase) {
    suspend fun createRetainedTask(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!.value

        val params = try {
            call.receive<RetainedTaskCreateRequest>().apply { validate() }
        } catch (exception: RequestValidationException) {
            throw UnprocessableEntityException(exception.error, exception)
        } catch (exception: Throwable) {
            throw BadRequestException(exception)
        }

        val task = try {
            taskUseCase.createRetainedTask(UserId(userId), TaskName(params.name))
        } catch (exception: DomainException) {
            throw UnprocessableEntityException(exception.message!!, exception)
        }

        call.respond(HttpStatusCode.Created, RetainedTaskCreateResponse(task.id.value, task.name.value))
    }

    suspend fun getRetainedTaskList(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!.value

        val retainedTaskList = taskUseCase.getRetainedTaskList(UserId(userId))

        call.respond(HttpStatusCode.OK, retainedTaskList)
    }

    suspend fun deleteRetainedTask(call: ApplicationCall, param: String?) {
        val userId = call.principal<UserIdPrincipal>()!!.value

        val message = "path parameter is not an integer. param = $param"

        val taskId = param?.toIntOrNull()
            ?: throw BadRequestException(call.request.uri, call.request.httpMethod.value, message)

        try {
            taskUseCase.deleteRetainedTask(UserId(userId), TaskId(taskId))
        } catch (exception: AuthorizationException) {
            throw ForbiddenException(call.request.uri, call.request.httpMethod.value, exception)
        }

        call.respond(HttpStatusCode.NoContent)
    }
}
