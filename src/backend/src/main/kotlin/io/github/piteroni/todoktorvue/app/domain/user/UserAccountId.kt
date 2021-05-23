package io.github.piteroni.todoktorvue.app.domain.user

class UserAccountId(val value: Int) {
    companion object {
        private const val unregisteredID = 0

        fun unregistered(): UserAccountId = UserAccountId(unregisteredID)
    }
}
