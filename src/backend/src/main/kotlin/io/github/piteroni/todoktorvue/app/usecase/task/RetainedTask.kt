package io.github.piteroni.todoktorvue.app.usecase.task

import kotlinx.serialization.Serializable

@Serializable
data class RetainedTask(val id: Int, val name: String)
