package io.github.piteroni.todoktorvue.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskMapper
import io.github.piteroni.todoktorvue.app.infrastructure.repositories.TaskRepository
import io.github.piteroni.todoktorvue.testing.factories.TaskDataSourceFactory
import io.github.piteroni.todoktorvue.testing.factories.TaskDataSourceFactory2
import io.github.piteroni.todoktorvue.testing.factories.UserDataSourceFactory
import io.github.piteroni.todoktorvue.testing.refresh
import io.github.piteroni.todoktorvue.testing.setUp
import io.kotest.core.spec.Spec
import io.kotest.core.spec.style.StringSpec
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import org.jetbrains.exposed.sql.transactions.transaction

class TaskRepositoryTest : StringSpec() {
    private val taskRepository = TaskRepository()

    override fun beforeSpec(spec: Spec) {
        setUp()
    }

    override fun afterEach(testCase: TestCase, result: TestResult) {
        refresh()
    }

    init {
        "未登録のタスクを渡すと、リポジトリにタスクが保存される" {
            val task = UserDataSourceFactory.make().run {
                Task(TaskId.unregistered(), asUser().id, TaskName("new-task"))
            }

            val createdTask = taskRepository.save(task)

            val storedTask = transaction {
                TaskDataSource.find { TaskMapper.id eq createdTask.id.value }.first().asTask()
            }

            createdTask.name shouldBe storedTask.name
            createdTask.userId shouldBe storedTask.userId
        }

        "タスクのIDを渡すと、タスクIDに一致するタスクをリポジトリを取得できる" {
            val userDataSource = UserDataSourceFactory.make()
            val taskId = transaction {
                TaskDataSourceFactory.make(userDataSource, "new-task").asTask().id
            }

            val task = taskRepository.find(taskId)!!

            task shouldNotBe null
            task.name shouldBe TaskName("new-task")
            task.userId shouldBe userDataSource.asUser().id
        }

        "タスクIDに一致するタスクがリポジトリ上に存在しない場合、nullが返る" {
            taskRepository.find(TaskId(1)) shouldBe null
        }

        "ユーザーIDを渡すと、タスク作成ユーザーのIDに一致するタスクをリポジトリから取得できる" {
            val userId = UserDataSourceFactory.make()
                .apply {
                    TaskDataSourceFactory2().count(5).make(this, "task")
                }.asUser().id

            val tasks = taskRepository.findAllByUserId(userId)

            tasks.count() shouldBe 5

            tasks.forEach { task ->
                task.userId shouldBe userId
                task.name shouldBe TaskName("task")
            }
        }

        "タスクのIDを渡すと、タスクIDに一致するタスクをリポジトリから削除できる" {
            val task = UserDataSourceFactory.make().run {
                Task(TaskId.unregistered(), asUser().id, TaskName("new-task"))
            }

            taskRepository.remove(task.id)

            val taskDataSource = transaction { TaskDataSource.find { TaskMapper.id eq task.id.value }.firstOrNull() }

            taskDataSource shouldBe null
        }
    }
}
