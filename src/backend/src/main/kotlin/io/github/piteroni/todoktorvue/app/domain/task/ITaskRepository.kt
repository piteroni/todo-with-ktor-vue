package io.github.piteroni.todoktorvue.app.domain.task

interface ITaskRepository {
    fun save(task: Task): Task

    fun findAllByUserId(userId: Int): List<Task>

    fun remove(taskId: Int)
}
