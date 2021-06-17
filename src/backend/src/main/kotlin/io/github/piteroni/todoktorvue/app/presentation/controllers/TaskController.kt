package io.github.piteroni.todoktorvue.app.presentation.controllers

import io.github.piteroni.todoktorvue.app.presentation.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.presentation.exceptions.BadRequestException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.ForbiddenException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.UnprocessableEntityException
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RequestValidationException
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RetainedTaskCreateRequest
import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.CreatedRetainedTask
import io.github.piteroni.todoktorvue.app.usecase.task.AuthorizationException
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskCreationInputData
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskCreationInputDataException
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskDeletionInputData
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskDeletionInputDataException
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.ktor.application.ApplicationCall
import io.ktor.auth.principal
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
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

        val inputData = RetainedTaskCreationInputData(userId, params.name)

        val task = try {
            taskUseCase.createRetainedTask(inputData)
        } catch (exception: RetainedTaskCreationInputDataException) {
            throw UnprocessableEntityException(exception.message!!, exception)
        }

        call.respond(HttpStatusCode.Created, CreatedRetainedTask(task.id.value, task.name.value))
    }

    suspend fun getRetainedTaskList(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!.value

        val retainedTaskList = taskUseCase.getRetainedTaskList(userId)

        call.respond(HttpStatusCode.OK, retainedTaskList)
    }

    suspend fun deleteRetainedTask(call: ApplicationCall, param: String?) {
        val userId = call.principal<UserIdPrincipal>()!!.value

        val taskId = param?.toIntOrNull() ?: throw BadRequestException("path parameter is not an integer. param = $param")

        val inputData = RetainedTaskDeletionInputData(userId, taskId)

        try {
            taskUseCase.deleteRetainedTask(inputData)
        } catch (exception: RetainedTaskDeletionInputDataException) {
            throw UnprocessableEntityException(exception.message!!, exception)
        } catch (exception: AuthorizationException) {
            throw ForbiddenException(exception)
        }

        call.respond(HttpStatusCode.NoContent)
    }
}
