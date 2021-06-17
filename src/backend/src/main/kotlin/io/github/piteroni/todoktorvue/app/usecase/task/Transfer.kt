package io.github.piteroni.todoktorvue.app.usecase.task

import kotlinx.serialization.Serializable

class AuthorizationException(message: String) : Exception(message)

class RetainedTaskCreationInputDataException(message: String) : Exception(message)

class RetainedTaskDeletionInputDataException(message: String) : Exception(message)

data class RetainedTaskCreationInputData(val userId: Int, val name: String)

data class RetainedTaskDeletionInputData(val userId: Int, val taskId: Int)

@Serializable
data class RetainedTask(val id: Int, val name: String)
