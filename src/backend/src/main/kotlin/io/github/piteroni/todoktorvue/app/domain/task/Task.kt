package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.domain.DomainException

class Task(
    val id: TaskId,
    val userId: UserId,
    val name: String
) {
    init {
        if (name.isEmpty()) {
            throw DomainException("Empty tasks cannot be created")
        }
    }

    companion object {
        fun create(userId: UserId, name: String) = Task(
            TaskId.unregistered(),
            userId,
            name
        )
    }
}
