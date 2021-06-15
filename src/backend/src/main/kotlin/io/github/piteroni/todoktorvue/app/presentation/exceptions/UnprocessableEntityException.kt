package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

private const val defaultMessage = "Validation payload of request failed"

class UnprocessableEntityException : HttpException {
    init {
        statusCode = HttpStatusCode.UnprocessableEntity
    }

    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, defaultMessage, cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
