package io.github.piteroni.todoktorvue.app.domain.task

import io.github.piteroni.todoktorvue.app.domain.DomainException

class Task(val id: Int, val name: String) {
    init {
        if (name.isEmpty()) {
            throw DomainException("Empty tasks cannot be created")
        }

        if (name.length > 256) {
            throw DomainException("Illegal email size, must be between 0-256. size = ${name.length}")
        }
    }
}
