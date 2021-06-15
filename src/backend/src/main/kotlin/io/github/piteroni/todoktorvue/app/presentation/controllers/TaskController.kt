package io.github.piteroni.todoktorvue.app.presentation.controllers

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.usecase.task.AuthorizationException
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.github.piteroni.todoktorvue.app.presentation.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RetainedTaskCreateRequest
import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.RetainedTaskCreateResponse
import io.github.piteroni.todoktorvue.app.presentation.exceptions.BadRequestException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.ForbiddenException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.InternalServerErrorException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.UnprocessableEntityException
import io.ktor.application.ApplicationCall
import io.ktor.auth.principal
import io.ktor.http.HttpStatusCode
import io.ktor.request.uri
import io.ktor.request.httpMethod
import io.ktor.request.receive
import io.ktor.response.respond

class TaskController(private val taskUseCase: TaskUseCase) {
    suspend fun createRetainedTask(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!

        val params = try {
            call.receive<RetainedTaskCreateRequest>().apply { validate() }
        } catch (exception: Throwable) {
            throw UnprocessableEntityException(call.request.uri, call.request.httpMethod.value, exception)
        }

        val task = try {
            taskUseCase.createRetainedTask(userId.value, params.name)
        } catch(exception: DomainException) {
            throw UnprocessableEntityException(call.request.uri, call.request.httpMethod.value, exception)
        }

        call.respond(HttpStatusCode.Created, RetainedTaskCreateResponse(task.id.value, task.name))
    }

    suspend fun getRetainedTaskList(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!

        val retainedTaskList = try {
            taskUseCase.getRetainedTaskList(userId.value)
        } catch (exception: DomainException) {
            throw InternalServerErrorException(call.request.uri, call.request.httpMethod.value, exception)
        }

        call.respond(HttpStatusCode.OK, retainedTaskList)
    }

    suspend fun deleteRetainedTask(call: ApplicationCall, param: String?) {
        val userId = call.principal<UserIdPrincipal>()!!

        val message = "path parameter is not an integer. param = $param"

        val taskId = param?.toIntOrNull()
            ?: throw BadRequestException(call.request.uri, call.request.httpMethod.value, message)

        try {
            taskUseCase.deleteRetainedTask(userId.value, taskId)
        } catch (exception: AuthorizationException) {
            throw ForbiddenException(call.request.uri, call.request.httpMethod.value, exception)
        }

        call.respond(HttpStatusCode.NoContent)
    }
}