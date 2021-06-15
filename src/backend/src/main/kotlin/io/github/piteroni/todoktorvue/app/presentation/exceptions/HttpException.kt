package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.HttpResponse
import io.github.piteroni.todoktorvue.app.presentation.transfer.responses.SimpleResponse
import io.ktor.http.HttpStatusCode

open class HttpException : Exception {
    var statusCode: HttpStatusCode = HttpStatusCode.InternalServerError
        protected set

    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, message: String) : super("$uri ($httpMethod): $message")
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super("$uri ($httpMethod): $message", cause)

    fun asResponse(): HttpResponse = SimpleResponse(message ?: "")
}
