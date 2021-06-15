package io.github.piteroni.todoktorvue.app.presentation.transfer.requests

import kotlinx.serialization.Serializable

@Serializable
data class RetainedTaskCreateRequest(val name: String) : HttpRequest {
    override fun validate() {
        // なんにもわからん
    }
}
