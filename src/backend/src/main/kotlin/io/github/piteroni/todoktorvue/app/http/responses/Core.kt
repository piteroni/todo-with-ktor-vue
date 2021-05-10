package io.github.piteroni.todoktorvue.app.http.responses

import kotlinx.serialization.Serializable

interface HttpResponse

@Serializable
data class SimpleResponse(val message: String) : HttpResponse
