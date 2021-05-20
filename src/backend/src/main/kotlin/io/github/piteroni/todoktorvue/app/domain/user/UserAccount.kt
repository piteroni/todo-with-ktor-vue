package io.github.piteroni.todoktorvue.app.domain.user

class UserAccount private constructor(
    val id: Int,
    val email: String,
    val password: String
) {
    companion object {
        fun of(id: Int, email: String, password: String): UserAccount = UserAccount(id, email, password)
    }
}
