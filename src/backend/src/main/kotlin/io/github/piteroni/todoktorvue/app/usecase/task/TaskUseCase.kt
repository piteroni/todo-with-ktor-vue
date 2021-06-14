package io.github.piteroni.todoktorvue.app.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository
import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.user.UserId

class AuthorizationException(message: String) : Exception(message)

class TaskUseCase(private val taskRepository: TaskRepository) {
    fun createRetainedTask(userId: Int, name: String): Task {
        val task = Task.create(UserId(userId), name)

        return taskRepository.save(task)
    }

    fun getRetainedTaskList(authorId: Int): List<RetainedTask> {
        return taskRepository.findAllByUserId(UserId(authorId)).map { RetainedTask(it.id.value, it.name) }
    }

    fun deleteRetainedTask(userId: Int, taskId: Int) {
        val task = taskRepository.find(TaskId(taskId))

        if (task == null || task.userId != UserId(userId)) {
            throw AuthorizationException("not have permission to delete tasks. userId = $userId")
        }

        taskRepository.remove(task.id)
    }
}
