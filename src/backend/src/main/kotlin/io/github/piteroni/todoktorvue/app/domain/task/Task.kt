package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.domain.DomainException

class Task(
    val id: TaskId,
    val userId: UserId,
    val name: TaskName
) {
    companion object {
        fun create(userId: UserId, name: TaskName) = Task(
            TaskId.unregistered(),
            userId,
            name
        )
    }
}
