package io.github.piteroni.todoktorvue.app.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.User
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserMapper
import org.jetbrains.exposed.sql.transactions.transaction
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository as IUserRepository

class UserRepository : IUserRepository {
    override fun findByEmail(email: Email): User? {
        return transaction {
            UserDataSource.find { UserMapper.email eq email.value }.firstOrNull()?.asUser()
        }
    }
}
