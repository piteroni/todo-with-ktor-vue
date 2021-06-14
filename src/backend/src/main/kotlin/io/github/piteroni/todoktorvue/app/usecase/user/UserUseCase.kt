package io.github.piteroni.todoktorvue.app.usecase.user

import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository
import io.github.piteroni.todoktorvue.app.domain.DomainException
import org.mindrot.jbcrypt.BCrypt

class AuthenticationException(message: String) : Exception(message)

class UserUseCase(private val userRepository: UserRepository) {
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
        val user = userRepository.findByEmail(Email(email))
            ?: throw AuthenticationException("there is no user matching the specified email. email = $email")

        if (!BCrypt.checkpw(password, user.account.password.value)) {
            throw AuthenticationException("password is wrong. email = $email")
        }

        return user.id.value
    }
}
