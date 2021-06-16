package io.github.piteroni.todoktorvue.app.presentation.transfer.requests

import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticateInputData
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(val email: String, val password: String) : HttpRequest {
    private val emailSize = 256
    private val passwordSize = 128

    override fun validate() {
        if (email.length > emailSize) {
            throw RequestValidationException(
                error = "Illegal email size, must be less then $emailSize",
                message = "Illegal email size, must be less then $emailSize. size = ${email.length}"
            )
        }

        if (password.length > passwordSize) {
            throw RequestValidationException(
                error = "Illegal password size, must be less then $passwordSize",
                message = "Illegal password size, must be less then $passwordSize. size = ${password.length}",
            )
        }
    }

    fun asInputData() = AuthenticateInputData(email, password)
}
