package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository

class TaskUseCase(private val taskRepository: ITaskRepository) {
    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return taskRepository.findAllByUserId(authorId).map { RetainedTask(it.id, it.name) }
    }
}
