package io.github.piteroni.todoktorvue.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.infrastructure.repositories.TaskRepository
import io.github.piteroni.todoktorvue.testing.factories.UserDataSourceFactory
import io.github.piteroni.todoktorvue.testing.setUp
import io.kotest.core.spec.style.FreeSpec
import io.kotest.core.test.TestCase
import io.kotest.matchers.shouldBe

class TaskRepositoryTest : FreeSpec({
    val taskRepository = TaskRepository()

    "Saving task" - {
        "When an unregistered task is passed, task can be registered in the repository" - {
            val userDataSource = UserDataSourceFactory.make()
            val task = Task(TaskId.unregistered(), userDataSource.asUser().id, TaskName("new-task"))

            val createdTask = taskRepository.save(task)

            createdTask.name shouldBe TaskName("new-task")
        }
    }
}) {
    init {
        setUp()
    }
}
