package io.github.piteroni.todoktorvue.app.http.requests

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(val email: String, val password: String) : HttpRequest {
    /**
     * validate of request payload.
     *
     * @return this.
     */
    override fun validate() {
        if (email.length < 0 || email.length > 255) {
            throw RequestValidationException("Illegal email size, must be between 0-255: ${email.length}")
        }

        if (password.length < 0 || password.length > 255) {
            throw RequestValidationException("Illegal password size, must be between 0-255: ${password.length}")
        }
    }
}
