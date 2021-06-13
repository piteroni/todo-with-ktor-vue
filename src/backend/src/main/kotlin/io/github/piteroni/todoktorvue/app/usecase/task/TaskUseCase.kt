package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository
import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.user.UserAccountId
import org.jetbrains.exposed.sql.transactions.transaction

class AuthorizationException(message: String) : Exception(message)

class TaskUseCase(private val taskRepository: ITaskRepository) {
    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return transaction {
            taskRepository.findAllByUserId(authorId).map { RetainedTask(it.taskId.value, it.name) }
        }
    }

    fun deleteRetainedTask(userId: Int, taskId: Int) {
        val task = transaction {
            taskRepository.findAllByUserId(userId).find { it.taskId.value == taskId }
                ?: throw AuthorizationException("not have permission to delete tasks. userId = $userId")
        }

        taskRepository.remove(task.taskId.value)
    }

    fun createRetainedTask(userId: Int, name: String): Task {
        val task = Task.create(UserAccountId(userId), name)

        return taskRepository.save(task)
    }
}
