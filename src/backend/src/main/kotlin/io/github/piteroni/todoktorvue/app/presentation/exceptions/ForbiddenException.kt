package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

private const val defaultMessage = "The requested operation is not authorized"

class ForbiddenException : HttpException {
    init {
        statusCode = HttpStatusCode.Forbidden
    }

    constructor(message: String?) : super(message)
    constructor(cause: Throwable?) : super(defaultMessage, cause)
    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, defaultMessage, cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
