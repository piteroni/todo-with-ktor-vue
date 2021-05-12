package io.github.piteroni.todoktorvue.app.persistence.repositories

import io.github.piteroni.todoktorvue.app.domain.user.UserAccount
import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.piteroni.todoktorvue.app.persistence.models.Users
import org.jetbrains.exposed.sql.ResultRow

fun ResultRow.asUser(): User = User(this[Users.id])

fun ResultRow.asUserAccount(): UserAccount = UserAccount(
    this[Users.id].value,
    this[Users.email],
    this[Users.password],
)
