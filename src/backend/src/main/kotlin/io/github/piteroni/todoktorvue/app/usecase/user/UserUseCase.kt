package io.github.piteroni.todoktorvue.app.usecase.user

import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.Password
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository
import org.mindrot.jbcrypt.BCrypt

class AuthenticationException(message: String) : Exception(message)

class UserUseCase(private val userRepository: UserRepository) {
    /**
     * authenticate the UserAccount.
     *
     * @param email email of UserAccount.
     * @param password password of UserAccount.
     * @return ID of the authenticated user account.
     */
    fun authenticate(email: Email, password: Password): Int {
        val user = userRepository.findByEmail(email)
            ?: throw AuthenticationException("there is no user matching the specified email. email = ${email.value}")

        if (!BCrypt.checkpw(password.value, user.account.password.value)) {
            throw AuthenticationException("password is wrong. email = ${email.value}")
        }

        return user.id.value
    }
}
