package io.github.piteroni.todoktorvue.app.domain.user

import io.github.piteroni.todoktorvue.app.domain.DomainException

interface Password {
    val value: String
}

data class RawPassword(override val value: String) : Password {
    init {
        if (value.length !in 8..256) {
            throw DomainException("Illegal password size, must be between 8-256. size = $value")
        }

        if (! Regex("""^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))([a-zA-Z0-9!@;:])+$""").containsMatchIn(value)) {
            throw DomainException("Password should contain only letters, numbers, and symbols")
        }
    }
}

data class HashedPassword(override val value: String) : Password
