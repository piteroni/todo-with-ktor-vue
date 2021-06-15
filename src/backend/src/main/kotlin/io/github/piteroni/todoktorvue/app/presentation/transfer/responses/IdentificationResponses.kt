package io.github.piteroni.todoktorvue.app.presentation.transfer.responses

import kotlinx.serialization.Serializable

@Serializable
data class AuthenticationToken(val token: String) : HttpResponse
