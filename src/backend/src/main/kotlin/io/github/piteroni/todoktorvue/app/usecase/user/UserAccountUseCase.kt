package io.github.piteroni.todoktorvue.app.usecase.user

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.piteroni.todoktorvue.app.usecase.identification.AuthenticationException
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

class UserAccountUseCase {
    /**
     * authenticate the UserAccount.
     *
     * @param email email of UserAccount.
     * @param password password of UserAccount.
     * @return ID of the authenticated user account.
     * @throws DomainException If the database has been populated with data that does not follow the domain.
     * @throws AuthenticationException when a user account is not authenticated.
     */
    fun authenticate(email: String, password: String): Int {
        val userAccount = transaction {
            User.find { Users.email eq email }.firstOrNull()?.asUserAccount()
        } ?: throw AuthenticationException("there is no user matching the specified email. email = $email")

        if (!BCrypt.checkpw(password, userAccount.password.value)) {
            throw AuthenticationException("password is wrong. email = $email")
        }

        return userAccount.id.value
    }
}
