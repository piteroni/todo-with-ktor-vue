package io.github.piteroni.todoktorvue.app.presentation.exceptions

import io.ktor.http.HttpStatusCode

class InternalServerErrorException : HttpException {
    init {
        statusCode = HttpStatusCode.InternalServerError
    }

    constructor(message: String?) : super(message)
    constructor(cause: Throwable?) : super("An error has occurred", cause)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
    constructor(uri: String, httpMethod: String, cause: Throwable) : super(uri, httpMethod, "An error has occurred", cause)
    constructor(uri: String, httpMethod: String, message: String, cause: Throwable) : super(uri, httpMethod, message, cause)
}
