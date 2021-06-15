package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.DomainException

data class TaskId(val value: Int) {
    init {
        if (value < 0) {
            throw DomainException("taskId cannot be less than 0, id = $value")
        }
    }

    companion object {
        private const val unregisteredID = 0

        fun unregistered(): TaskId = TaskId(unregisteredID)
    }
}
