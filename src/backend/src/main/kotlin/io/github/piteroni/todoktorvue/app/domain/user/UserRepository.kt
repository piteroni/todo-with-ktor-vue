package io.github.piteroni.todoktorvue.app.domain.user

interface UserRepository {
    fun findByEmail(email: Email): User?
}
