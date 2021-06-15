package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.DomainException

data class TaskName(val value: String) {
    init {
        if (value.isEmpty()) {
            throw DomainException("Empty tasks cannot be created")
        }
    }
}
