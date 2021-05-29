package io.github.piteroni.todoktorvue.app.http.controllers

import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.ktor.application.ApplicationCall
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.response.*

class TaskController(private val taskUseCase: TaskUseCase) {
    suspend fun getRetainedTaskList(call: ApplicationCall) {
        val userId = call.principal<UserIdPrincipal>()!!

        val retainedTaskList = taskUseCase.getRetainedTaskList(userId.value)

        call.respond(HttpStatusCode.OK, retainedTaskList)
    }
}