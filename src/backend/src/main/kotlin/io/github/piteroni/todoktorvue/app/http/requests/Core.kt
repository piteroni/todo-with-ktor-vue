package io.github.piteroni.todoktorvue.app.http.requests

class RequestValidationException(message: String) : Exception(message)

interface HttpRequest {
    /**
     * @throws RequestValidationException
     */
    fun validate(): Unit
}
