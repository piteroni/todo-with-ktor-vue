package io.github.piteroni.todoktorvue.usecase.task

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository
import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.usecase.task.AuthorizationException
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTask
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskCreationInputData
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskCreationInputDataException
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskDeletionInputData
import io.github.piteroni.todoktorvue.app.usecase.task.RetainedTaskDeletionInputDataException
import io.github.piteroni.todoktorvue.app.usecase.task.TaskUseCase
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.spec.style.FreeSpec
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import io.kotest.matchers.shouldBe
import io.mockk.called
import io.mockk.clearAllMocks
import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify

class TaskUseCaseTest : FreeSpec() {
    private val taskRepository = mockk<TaskRepository>()
    private val taskUseCase = TaskUseCase(taskRepository)

    override fun afterEach(testCase: TestCase, result: TestResult) {
        clearAllMocks()
    }

    init {
        "保有タスク作成処理" - {
            "タスク作成に必要な情報を渡すと、リポジトリに保有タスクが保存される" - {
                val inputData = RetainedTaskCreationInputData(88, "new-task")
                val toBeCreatedTask = slot<Task>()

                every { taskRepository.save(any()) } returnsArgument 0

                val createdTask = taskUseCase.createRetainedTask(inputData)

                /* repositoryにタスクオブジェクトが渡される */
                verify(exactly = 1) { taskRepository.save(capture(toBeCreatedTask)) }
                confirmVerified(taskRepository)
                toBeCreatedTask.captured.id shouldBe TaskId.unregistered()
                toBeCreatedTask.captured.userId shouldBe UserId(88)
                toBeCreatedTask.captured.name shouldBe TaskName("new-task")
                /* repositoryの返り値がそのまま返る */
                createdTask.id shouldBe TaskId.unregistered()
                createdTask.userId shouldBe UserId(88)
                createdTask.name shouldBe TaskName("new-task")
            }

            "タスク名のドメインに従わない入力データを渡すと例外が送出され、リポジトリに保有タスクは保存されない" - {
                val inputData = RetainedTaskCreationInputData(88, "")

                every { taskRepository.save(any()) }

                shouldThrow<RetainedTaskCreationInputDataException> {
                    taskUseCase.createRetainedTask(inputData)
                }

                verify { taskRepository.save(any()) wasNot called }
                confirmVerified(taskRepository)
            }
        }

        "保有タスクリスト取得処理" - {
            "保有タスクリストをリポジトリから取得できる" - {
                val tasks: List<Task> = listOf(
                    Task(TaskId(1), UserId(1), TaskName("saved-task-1")),
                    Task(TaskId(2), UserId(1), TaskName("saved-task-2")),
                    Task(TaskId(3), UserId(1), TaskName("saved-task-3"))
                )

                val expected: List<RetainedTask> = listOf(
                    RetainedTask(1, "saved-task-1"),
                    RetainedTask(2, "saved-task-2"),
                    RetainedTask(3, "saved-task-3")
                )

                every { taskRepository.findAllByUserId(UserId(1)) } returns tasks

                val retainedTaskList = taskUseCase.getRetainedTaskList(1)

                /* 引数に渡したユーザーIDがユーザーID検索条件に指定される */
                verify(exactly = 1) { taskRepository.findAllByUserId(UserId(1)) }
                confirmVerified(taskRepository)
                retainedTaskList.count() shouldBe 3
                retainedTaskList shouldBe expected
            }
        }

        "保有タスク削除処理" - {
            "タスク削除に必要な情報を渡すと、リポジトリに保存されている該当の保有タスクが削除される" - {
                val userId = 22
                val taskId = 39
                val inputData = RetainedTaskDeletionInputData(userId, taskId)

                val task = Task(TaskId(taskId), UserId(userId), TaskName("saved-task-1"))

                every { taskRepository.find(any()) } returns task
                every { taskRepository.remove(any()) } returns Unit

                taskUseCase.deleteRetainedTask(inputData)

                verify(exactly = 1) {
                    taskRepository.find(TaskId(taskId))
                    taskRepository.remove(TaskId(taskId))
                }

                confirmVerified(taskRepository)
            }

            "タスクIDのドメインに従わない入力データを渡すと例外が送出され、リポジトリに保存されている該当の保有タスクは削除されない" - {
                val userId = 130
                val taskId = -1
                val inputData = RetainedTaskDeletionInputData(userId, taskId)

                every { taskRepository.find(any()) }
                every { taskRepository.remove(any()) }

                shouldThrow<RetainedTaskDeletionInputDataException> {
                    taskUseCase.deleteRetainedTask(inputData)
                }

                verify(exactly = 0) { taskRepository.find(any()) }
                verify(exactly = 0) { taskRepository.remove(any()) }
                confirmVerified(taskRepository)
            }


            """
            指定したユーザーIDとリポジトリに保存されているタスクの作成ユーザーのIDが異なる場合、
            例外が送出され、リポジトリに保存されている該当の保有タスクは削除されない
            """.trimIndent() - {
                val userId = 49
                val authorId = 41
                val taskId = 82
                val inputData = RetainedTaskDeletionInputData(userId, taskId)

                val task = Task(TaskId(taskId), UserId(authorId), TaskName("saved-task-1"))

                every { taskRepository.find(any()) } returns task
                every { taskRepository.remove(any()) } returns Unit

                shouldThrow<AuthorizationException> {
                    taskUseCase.deleteRetainedTask(inputData)
                }

                verify(exactly = 1) { taskRepository.find(TaskId(taskId)) }
                verify(exactly = 0) { taskRepository.remove(any()) }
                confirmVerified(taskRepository)
            }

            """
            指定したタスクIDに一致する保有タスクがリポジトリ上に存在しない場合、
            例外が送出され、リポジトリに保存されている該当の保有タスクは削除されない
            """.trimIndent() - {
                val userId = 130
                val taskId = 82
                val inputData = RetainedTaskDeletionInputData(userId, taskId)

                every { taskRepository.find(any()) } returns null
                every { taskRepository.remove(any()) } returns Unit

                shouldThrow<AuthorizationException> {
                    taskUseCase.deleteRetainedTask(inputData)
                }

                verify(exactly = 1) { taskRepository.find(TaskId(taskId)) }
                verify(exactly = 0) { taskRepository.remove(any()) }
                confirmVerified(taskRepository)
            }
        }
    }
}
