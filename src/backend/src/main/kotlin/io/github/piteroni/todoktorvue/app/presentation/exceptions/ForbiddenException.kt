package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

class ForbiddenException : HttpException {
    init {
        statusCode = HttpStatusCode.Forbidden
    }

    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, "The requested operation is not authorized", cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}