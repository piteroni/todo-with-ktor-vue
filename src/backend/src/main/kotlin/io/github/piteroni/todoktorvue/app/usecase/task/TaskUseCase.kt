package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository
import org.jetbrains.exposed.sql.transactions.transaction

class AuthorizationException(message: String) : Exception(message)

class TaskUseCase(private val taskRepository: ITaskRepository) {
    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return transaction {
            taskRepository.findAllByUserId(authorId).map { RetainedTask(it.id, it.name) }
        }
    }

    /**
     * @throws AuthorizationException
     */
    fun deleteRetainedTask(userId: Int, taskId: Int) {
        val task = transaction {
            taskRepository.findAllByUserId(userId).find { it.id == taskId }
                ?: throw AuthorizationException("not have permission to delete tasks. userId = $userId")
        }

        transaction {
            taskRepository.remove(task.id)
        }
    }
}
