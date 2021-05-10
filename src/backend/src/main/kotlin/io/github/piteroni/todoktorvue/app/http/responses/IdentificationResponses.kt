package io.github.piteroni.todoktorvue.app.http.responses

import kotlinx.serialization.Serializable

@Serializable
data class ApiToken(val token: String): HttpResponse
