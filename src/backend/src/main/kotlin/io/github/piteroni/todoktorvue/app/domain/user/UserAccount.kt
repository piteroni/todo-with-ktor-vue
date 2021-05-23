package io.github.piteroni.todoktorvue.app.domain.user

class UserAccount private constructor(
    val id: UserAccountId,
    val email: Email,
    val password: Password
) {
    companion object {
        fun of(id: Int, email: String, password: String): UserAccount {
            return UserAccount(
                UserAccountId(id),
                Email(email),
                HashedPassword(password)
            )
        }

        fun create(email: String, password: String): UserAccount {
            return UserAccount(
                UserAccountId.unregistered(),
                Email(email),
                RawPassword(password)
            )
        }
    }
}
