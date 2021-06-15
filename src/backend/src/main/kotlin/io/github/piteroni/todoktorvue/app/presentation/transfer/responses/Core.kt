package io.github.piteroni.todoktorvue.app.presentation.transfer.responses

import kotlinx.serialization.Serializable

interface HttpResponse

@Serializable
data class SimpleResponse(val message: String) : HttpResponse
