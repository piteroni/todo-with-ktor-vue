package io.github.piteroni.todoktorvue.app.http.requests

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(val email: String, val password: String) : HttpRequest {
    /**
     * validate of request payload.
     */
    override fun validate() {
        if (email.isEmpty() || email.length > 256) {
            throw RequestValidationException("Illegal email size, must be between 0-256: ${email.length}")
        }

        if (password.isEmpty() || password.length > 128) {
            throw RequestValidationException("Illegal password size, must be between 0-128: ${password.length}")
        }
    }
}
