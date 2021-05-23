package io.github.piteroni.todoktorvue.app.http.controllers

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.domain.DomainException
import io.github.piteroni.todoktorvue.app.http.exceptions.InternalServerErrorException
import io.github.piteroni.todoktorvue.app.http.exceptions.UnauthorizedException
import io.github.piteroni.todoktorvue.app.http.exceptions.UnprocessableEntityException
import io.github.piteroni.todoktorvue.app.http.requests.LoginRequest
import io.github.piteroni.todoktorvue.app.http.responses.AuthenticationToken
import io.github.piteroni.todoktorvue.app.usecase.identification.AuthenticationException
import io.github.piteroni.todoktorvue.app.usecase.user.UserAccountUseCase
import io.ktor.application.ApplicationCall
import io.ktor.http.HttpStatusCode
import io.ktor.request.httpMethod
import io.ktor.request.receive
import io.ktor.request.uri
import io.ktor.response.respond

class IdentificationController(private val jwt: JWT, private val userAccountUseCase: UserAccountUseCase) {
    /**
     * Login to the application.
     *
     * @param call
     */
    suspend fun login(call: ApplicationCall) {
        val params = try {
            call.receive<LoginRequest>().apply { validate() }
        } catch (exception: Throwable) {
            throw UnprocessableEntityException(call.request.uri, call.request.httpMethod.value, exception)
        }

        val userAccountId = try {
            userAccountUseCase.authenticate(params.email, params.password)
        } catch (exception: AuthenticationException) {
            val message = "authentication failed"
            throw UnauthorizedException(call.request.uri, call.request.httpMethod.value, message, exception)
        } catch (exception: DomainException) {
            val message = "the database has been populated with data that does not follow the domain"
            throw InternalServerErrorException(call.request.uri, call.request.httpMethod.value, message, exception)
        }

        val token = jwt.createToken(userAccountId)

        call.respond(HttpStatusCode.OK, AuthenticationToken(token))
    }
}
