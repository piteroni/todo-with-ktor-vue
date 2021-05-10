package io.github.piteroni.todoktorvue.app.intractor.identification

import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.piteroni.todoktorvue.app.persistence.repositories.asUserAccount
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

class AuthenticationException(message: String): Exception(message)

class Authentication {
    /**
     * authenticate the UserAccount.
     */
    fun authenticate(email: String, password: String): String {
        val userAccount = transaction {
            Users.select { Users.email eq email }.firstOrNull()?.asUserAccount()
        } ?: throw AuthenticationException("there is no user matching the specified email")

        if (!BCrypt.checkpw(password, userAccount.password)) {
            throw AuthenticationException("password is wrong")
        }

        return JWT.createToken(userAccount.id, makeJWTConfig())
    }
}
