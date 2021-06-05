package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository
import org.jetbrains.exposed.sql.transactions.transaction

class TaskUseCase(private val taskRepository: ITaskRepository) {
    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return transaction {
            taskRepository.findAllByUserId(authorId).map { RetainedTask(it.id, it.name) }
        }
    }
}
