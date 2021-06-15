package io.github.piteroni.todoktorvue.app.presentation.dto.responses

import kotlinx.serialization.Serializable

@Serializable
data class RetainedTaskCreateResponse(val taskId: Int, val name: String)
