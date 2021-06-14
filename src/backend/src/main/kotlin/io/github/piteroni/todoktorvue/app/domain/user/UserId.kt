package io.github.piteroni.todoktorvue.app.domain.user

import io.github.piteroni.todoktorvue.app.domain.DomainException

data class UserId(val value: Int) {
    init {
        if (value < 0) {
            throw DomainException("userId cannot be less than 0, id = $value")
        }
    }

    companion object {
        private const val unregistered = 0

        fun unregistered(): UserId = UserId(unregistered)
    }
}
