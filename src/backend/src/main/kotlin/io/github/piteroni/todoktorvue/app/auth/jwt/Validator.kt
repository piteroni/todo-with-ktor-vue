package io.github.piteroni.todoktorvue.app.auth.jwt

import io.github.piteroni.todoktorvue.app.auth.UserIdPrincipal
import io.ktor.auth.jwt.JWTCredential

object Validator {
    fun validate(credential: JWTCredential, jwtConfig: JWTConfig): UserIdPrincipal? {
        return if (credential.payload.audience.contains(jwtConfig.audience)) {
            UserIdPrincipal(credential.payload.getClaim("userId").asInt())
        } else {
            null
        }
    }
}
