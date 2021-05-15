package io.github.piteroni.todoktorvue.app.http.requests

class RequestValidationException(message: String) : Exception(message)

interface HttpRequest {
    /**
     *
     * validate of request payload.
     *
     * @throws RequestValidationException
     */
    fun validate(): Unit
}
