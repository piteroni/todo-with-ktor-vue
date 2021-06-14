package io.github.piteroni.todoktorvue.app.domain.user

class UserAccount(
    val email: Email,
    val password: Password
) {
    companion object {
        fun create(email: String, password: String): UserAccount {
            return UserAccount(
                Email(email),
                RawPassword(password)
            )
        }
    }
}
