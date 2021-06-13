package io.github.piteroni.todoktorvue.app.http.requests

import kotlinx.serialization.Serializable

@Serializable
data class RetainedTaskCreateRequest(val name: String) : HttpRequest {
    override fun validate() {
        // なんにもわからん
    }
}
