package io.github.piteroni.todoktorvue.app.domain.task

interface ITaskRepository {
    fun findAllByUserId(userId: Int): List<Task>

    fun remove(taskId: Int)
}
