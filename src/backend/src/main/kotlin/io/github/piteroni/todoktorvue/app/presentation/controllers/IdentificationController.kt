package io.github.piteroni.todoktorvue.app.presentation.controllers

import io.github.piteroni.todoktorvue.app.presentation.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.presentation.exceptions.BadRequestException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.UnauthorizedException
import io.github.piteroni.todoktorvue.app.presentation.exceptions.UnprocessableEntityException
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.LoginRequest
import io.github.piteroni.todoktorvue.app.presentation.transfer.requests.RequestValidationException
import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.AuthenticationToken
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticateInputData
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticateInputDataException
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticationException
import io.github.piteroni.todoktorvue.app.usecase.user.UserUseCase
import io.ktor.application.ApplicationCall
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond

class IdentificationController(private val jwt: JWT, private val userUseCase: UserUseCase) {
    /**
     * Login to the application.
     */
    suspend fun login(call: ApplicationCall) {
        val params = try {
            call.receive<LoginRequest>().apply { validate() }
        } catch (exception: RequestValidationException) {
            throw UnprocessableEntityException(exception.error, exception)
        } catch (exception: Throwable) {
            throw BadRequestException(exception)
        }

        val inputData = AuthenticateInputData(params.email, params.password)

        val userId = try {
            userUseCase.authenticate(inputData)
        } catch (exception: AuthenticateInputDataException) {
            throw UnprocessableEntityException(exception.message!!, exception)
        } catch (exception: AuthenticationException) {
            throw UnauthorizedException(exception)
        }

        val token = jwt.createToken(userId)

        call.respond(HttpStatusCode.OK, AuthenticationToken(token))
    }
}
