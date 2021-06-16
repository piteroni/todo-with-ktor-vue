package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository
import io.github.piteroni.todoktorvue.app.domain.user.UserId

class AuthorizationException(message: String) : Exception(message)

class RetainedTaskCreationInputDataException(message: String) : Exception(message)

data class RetainedTaskCreationInputData(val userId: Int, val name: String)

class TaskUseCase(private val taskRepository: TaskRepository) {
    fun createRetainedTask(inputData: RetainedTaskCreationInputData): Task {
        val userId: UserId
        val name: TaskName

        try {
            userId = UserId(inputData.userId)
            name = TaskName(inputData.name)
        } catch (exception: DomainException) {
            throw RetainedTaskCreationInputDataException(exception.message!!)
        }

        val task = Task.create(userId, name)

        return taskRepository.save(task)
    }

    fun getRetainedTaskList(authorId: UserId): List<RetainedTask> {
        return taskRepository.findAllByUserId(authorId).map { RetainedTask(it.id.value, it.name.value) }
    }

    fun deleteRetainedTask(userId: UserId, taskId: TaskId) {
        val task = taskRepository.find(taskId)

        if (task == null || task.userId != userId) {
            throw AuthorizationException("not have permission to delete tasks. userId = $userId")
        }

        taskRepository.remove(task.id)
    }
}
