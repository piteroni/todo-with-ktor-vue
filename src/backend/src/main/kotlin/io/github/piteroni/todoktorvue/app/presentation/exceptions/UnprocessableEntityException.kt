package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

class UnprocessableEntityException : HttpException {
    init {
        statusCode = HttpStatusCode.UnprocessableEntity
    }

    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, "Serialization of request failed", cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
