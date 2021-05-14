package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.auth.jwt.Validator
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTVerifier
import io.github.piteroni.todoktorvue.app.http.config.CORSConfig
import io.github.piteroni.todoktorvue.app.http.exceptions.HttpException
import io.github.piteroni.todoktorvue.app.http.exceptions.InternalServerErrorException
import io.github.piteroni.todoktorvue.app.utils.UnknownPropertyException
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.jwt.jwt
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.features.DefaultHeaders
import io.ktor.features.StatusPages
import io.ktor.response.respond
import io.ktor.serialization.json

internal fun Application.applyMiddlewares() {
    install(DefaultHeaders)
    install(CallLogging)
    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        // for chrome preflight request
        allowNonSimpleContentTypes = true

        header("*")

        val config = try {
            CORSConfig()
        } catch (exception: UnknownPropertyException) {
            throw InternalServerErrorException(exception)
        }

        methods.addAll(config.allowMethods)
        hosts.addAll(config.allowHosts)
    }

    install(StatusPages) {
        exception<HttpException> { cause ->
            call.respond(cause.statusCode, cause.asResponse())

            when (cause.statusCode.value) {
                in 400..499 -> environment.log.warn(cause.stackTraceToString())
                in 500..599 -> environment.log.error(cause.stackTraceToString())
                else -> environment.log.error(cause.stackTraceToString())
            }
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
            validate { credential -> Validator.validate(credential, jwtConfig) }
        }
    }
}
