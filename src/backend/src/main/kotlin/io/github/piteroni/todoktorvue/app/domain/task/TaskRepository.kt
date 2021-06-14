package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.user.UserId

interface TaskRepository {
    fun save(task: Task): Task

    fun find(taskId: TaskId): Task?

    fun findAllByUserId(userId: UserId): List<Task>

    fun remove(taskId: TaskId)
}
