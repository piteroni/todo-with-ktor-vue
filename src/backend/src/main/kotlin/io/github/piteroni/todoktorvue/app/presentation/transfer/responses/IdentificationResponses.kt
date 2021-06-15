package io.github.piteroni.todoktorvue.app.presentation.dto.responses

import kotlinx.serialization.Serializable

@Serializable
data class AuthenticationToken(val token: String) : HttpResponse
