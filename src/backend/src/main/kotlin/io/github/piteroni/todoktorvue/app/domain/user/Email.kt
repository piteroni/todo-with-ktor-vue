package io.github.piteroni.todoktorvue.app.domain.user

import io.github.piteroni.todoktorvue.app.domain.DomainException

data class Email(val value: String) {
    init {
        if (value.length !in 3..256) {
            throw DomainException("Illegal email size, must be between 3-256. size = ${value.length}")
        }

        if (! Regex("^[a-zA-Z0-9.!#\$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").containsMatchIn(value)) {
            throw DomainException("Incorrect email address format")
        }
    }
}
