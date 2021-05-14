package io.github.piteroni.todoktorvue.app.auth.jwt

import com.auth0.jwt.JWT as Auth0JWT
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.Date

interface JWT {
    /**
     * create jwt token.
     */
    fun createToken(userId: Int, config: JWTConfig): String
}

class JWTImpl : JWT {
    override fun createToken(userId: Int, config: JWTConfig): String = Auth0JWT
        .create()
        .withAudience(config.audience)
        .withExpiresAt(Date.from(LocalDateTime.now().plusHours(config.expiration).toInstant(ZoneOffset.UTC)))
        .withClaim("userId", userId)
        .withIssuer(config.issuer)
        .sign(config.algorithm)
}
