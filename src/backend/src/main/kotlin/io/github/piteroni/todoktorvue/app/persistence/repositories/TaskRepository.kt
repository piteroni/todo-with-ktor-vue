package io.github.piteroni.todoktorvue.app.persistence.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository

class TaskRepository : ITaskRepository {
    override fun findAllByUserId(userId: Int): List<Task> {
        val tasks = mutableListOf<Task>()

        val user = User.find { Users.id eq userId }.firstOrNull() ?: return tasks

        user.tasks.forEach { task ->
            tasks.add(Task(task.id.value, task.name))
        }

        return tasks
    }
}
