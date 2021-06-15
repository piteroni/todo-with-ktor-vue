package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

private const val defaultMessage = "authentication failed"

class UnauthorizedException : HttpException {
    init {
        statusCode = HttpStatusCode.Unauthorized
    }

    constructor(cause: Throwable) : super(defaultMessage, cause)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
