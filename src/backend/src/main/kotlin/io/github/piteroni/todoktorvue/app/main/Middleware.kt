package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.jwt.Validator
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTVerifier
import io.github.piteroni.todoktorvue.app.utils.UnknownPropertyException
import io.github.piteroni.todoktorvue.app.http.config.CORSConfig
import io.github.piteroni.todoktorvue.app.http.exceptions.HttpException
import io.github.piteroni.todoktorvue.app.http.exceptions.InternalServerErrorException
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.features.*
import io.ktor.serialization.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*

internal fun Application.applyMiddlewares() {
    install(DefaultHeaders)
    install(CallLogging)
    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        header("*")
        header("key")

        val config = try {
            CORSConfig()
        } catch (exception: UnknownPropertyException) {
            throw InternalServerErrorException(exception)
        }
        config.allowMethods.forEach { method -> method(method) }
        config.allowHosts.forEach { host -> host(host) }
    }

    install(StatusPages) {
        exception<HttpException> { cause ->
            call.respond(cause.statusCode, cause.asResponse())

            throw cause
        }
    }

    install(Authentication) {
        val jwtConfig = try {
            makeJWTConfig()
        } catch (exception: UnknownPropertyException) {
            throw InternalServerErrorException(exception)
        }

        jwt {
            realm = jwtConfig.realm
            verifier(makeJWTVerifier(jwtConfig))
            validate { Validator.validate(it, jwtConfig) }
        }
    }
}
