package io.github.piteroni.todoktorvue.app.usecase.user

import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.Password
import io.github.piteroni.todoktorvue.app.domain.user.RawPassword
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository
import org.mindrot.jbcrypt.BCrypt

class UserUseCase(private val userRepository: UserRepository) {
    /**
     * authenticate the UserAccount.
     *
     * @param inputData
     * @return ID of the authenticated user account.
     * @throws AuthenticateInputDataException
     * @throws AuthenticationException
     */
    fun authenticate(inputData: AuthenticateInputData): Int {
        val email: Email
        val password: Password

        try {
            email = Email(inputData.email)
            password = RawPassword(inputData.password)
        } catch (exception: DomainException) {
            throw AuthenticateInputDataException(exception.message!!)
        }

        val user = userRepository.findByEmail(email)
            ?: throw AuthenticationException("there is no user matching the specified email. email = ${email.value}")

        if (!BCrypt.checkpw(password.value, user.account.password.value)) {
            throw AuthenticationException("password is wrong. email = ${email.value}")
        }

        return user.id.value
    }
}
