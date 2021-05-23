package io.github.piteroni.todoktorvue.app.domain.user

import io.github.piteroni.todoktorvue.app.domain.DomainException

data class Email(val value: String) {
    init {
        if (value.length !in 3..128) {
            throw DomainException("Illegal email size, must be between 3-128. size = ${value.length}")
        }
    }
}
