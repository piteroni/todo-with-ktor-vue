package io.github.piteroni.todoktorvue.app.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.User
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository as IUserRepository
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserMapper
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import org.jetbrains.exposed.sql.transactions.transaction

class UserRepository : IUserRepository {
    override fun findByEmail(email: Email): User? {
        return transaction {
            UserDataSource.find { UserMapper.email eq email.value }.firstOrNull()?.asUser()
        }
    }
}
