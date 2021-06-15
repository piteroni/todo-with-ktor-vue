package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

private const val defaultMessage = "Serialization of request failed"

class BadRequestException : HttpException {
    init {
        statusCode = HttpStatusCode.BadRequest
    }

    constructor(message: String?) : super(message)
    constructor(cause: Throwable) : super(defaultMessage, cause)

    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, message: String) : super(uri, httpMethod, message)

    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, defaultMessage, cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}