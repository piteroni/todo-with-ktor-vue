package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.user.UserAccountId

class Task private constructor(val taskId: TaskId, val userAccountId: UserAccountId, val name: String) {
    init {
        if (name.isEmpty()) {
            throw DomainException("Empty tasks cannot be created")
        }

        if (name.length > 256) {
            throw DomainException("Illegal email size, must be between 0-256. size = ${name.length}")
        }
    }

    companion object {
        fun of(id: Int, userAccountId: UserAccountId, name: String) = Task(
            TaskId(id),
            userAccountId,
            name
        )

        fun create(userAccountId: UserAccountId, name: String) = Task(
            TaskId.unregistered(),
            userAccountId,
            name
        )
    }
}
