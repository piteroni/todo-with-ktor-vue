package io.github.piteroni.todoktorvue.app.presentation.transfer.requests

import kotlinx.serialization.Serializable

@Serializable
data class RetainedTaskCreateRequest(val name: String) : HttpRequest {
    private val nameSize = 256

    override fun validate() {
        if (name.length > nameSize) {
            throw RequestValidationException(
                error = "Illegal task name size, must be less then $nameSize",
                message = "Illegal task name size, must be less then $nameSize. size = ${name.length}"
            )
        }
    }
}
