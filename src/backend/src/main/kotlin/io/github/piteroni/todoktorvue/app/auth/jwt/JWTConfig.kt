package io.github.piteroni.todoktorvue.app.auth.jwt

import com.auth0.jwt.algorithms.Algorithm
import io.github.piteroni.todoktorvue.app.utils.Config

data class JWTConfig(val issuer: String, val audience: String, val realm: String, val algorithm: Algorithm, val expiration: Long)

fun makeJWTConfig(): JWTConfig = JWTConfig(
    issuer = Config.get("JWT_ISSUER"),
    audience = Config.get("JWT_AUDIENCE"),
    realm = Config.get("JWT_REALM"),
    algorithm = Algorithm.HMAC256(Config.get("JWT_SECRET")),
    expiration = Config.get("JWT_EXPIRATION_HOUR").toLong()
)
