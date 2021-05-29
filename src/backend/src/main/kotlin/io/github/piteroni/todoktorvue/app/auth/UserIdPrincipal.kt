package io.github.piteroni.todoktorvue.app.auth

import io.ktor.auth.Principal
import kotlinx.serialization.Serializable

@Serializable
data class UserIdPrincipal(val value: Int) : Principal
