package io.github.piteroni.todoktorvue.app.http.controllers

import io.github.piteroni.todoktorvue.app.http.exceptions.UnauthorizedException
import io.github.piteroni.todoktorvue.app.http.requests.LoginRequest
import io.github.piteroni.todoktorvue.app.http.exceptions.UnprocessableEntityException
import io.github.piteroni.todoktorvue.app.http.responses.ApiToken
import io.github.piteroni.todoktorvue.app.http.responses.SimpleResponse
import io.github.piteroni.todoktorvue.app.intractor.identification.Authentication
import io.github.piteroni.todoktorvue.app.intractor.identification.AuthenticationException
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*

class IdentificationController {
    /**
     * Login to the application.
     * 
     * @param call
     */
    suspend fun login(call: ApplicationCall): Unit {
        val params = try {
            call.receive<LoginRequest>().apply { validate() }
        } catch(exception: Throwable) {
            throw UnprocessableEntityException(call.request.uri, call.request.httpMethod.value, exception)
        }

        val token = try {
            Authentication().authenticate(params.email, params.password)
        } catch (exception: AuthenticationException) {
            throw UnauthorizedException(call.request.uri, call.request.httpMethod.value, "authentication failed", exception)
        }

        call.respond(HttpStatusCode.OK, ApiToken(token))
    }
}