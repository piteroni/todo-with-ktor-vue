package io.github.piteroni.todoktorvue.app.presentation.transfer.requests

class RequestValidationException(message: String, val error: String) : Exception(message)

interface HttpRequest {
    /**
     *
     * validate of request payload.
     *
     * @throws RequestValidationException
     */
    fun validate()
}
