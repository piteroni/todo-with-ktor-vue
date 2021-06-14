package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

class UnauthorizedException : HttpException {
    init {
        statusCode = HttpStatusCode.Unauthorized
    }

    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
