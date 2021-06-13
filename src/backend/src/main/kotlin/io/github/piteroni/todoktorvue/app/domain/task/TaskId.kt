package io.github.piteroni.todoktorvue.app.domain.task

data class TaskId(val value: Int) {
    companion object {
        private const val unregisteredID = 0

        fun unregistered(): TaskId = TaskId(unregisteredID)
    }
}
