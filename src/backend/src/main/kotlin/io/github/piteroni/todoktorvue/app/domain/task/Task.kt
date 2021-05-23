package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.DomainException

class Task(val task: String) {
    init {
        if (task.isEmpty()) {
            throw DomainException("Empty tasks cannot be created")
        }

        if (task.length > 256) {
            throw DomainException("Illegal email size, must be between 0-256. size = ${task.length}")
        }
    }
}
