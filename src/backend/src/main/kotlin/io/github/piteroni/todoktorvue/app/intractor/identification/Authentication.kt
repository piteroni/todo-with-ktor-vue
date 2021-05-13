package io.github.piteroni.todoktorvue.app.intractor.identification

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.piteroni.todoktorvue.app.persistence.repositories.asUserAccount
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

class AuthenticationException(message: String) : Exception(message)

class Authentication {
    /**
     * authenticate the UserAccount.
     *
     * @param email email of UserAccount.
     * @param password password of UserAccount.
     * @return ID of the authenticated user account.
     * @throws AuthenticationException when a user account is not authenticated.
     */
    fun authenticate(email: String, password: String): Int {
        val userAccount = transaction {
            Users.select { Users.email eq email }.firstOrNull()?.asUserAccount()
        } ?: throw AuthenticationException("there is no user matching the specified email. email = $email")

        if (!BCrypt.checkpw(password, userAccount.password)) {
            throw AuthenticationException("password is wrong. email = $email")
        }

        return userAccount.id
    }
}
