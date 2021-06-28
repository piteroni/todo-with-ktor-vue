package io.github.piteroni.todoktorvue.app.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskMapper
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserMapper
import org.jetbrains.exposed.sql.transactions.transaction
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository as ITaskRepository

class TaskRepository : ITaskRepository {
    /**
     * Save the task.
     *
     * @param task Task to save.
     * @return Saved task.
     */
    override fun save(task: Task): Task {
        val userDataSource = transaction {
            UserDataSource.find { UserMapper.id eq task.userId.value }.first()
        }

        return transaction {
            TaskDataSource.new {
                name = task.name.value
                user = userDataSource
            }.asTask()
        }
    }

    override fun find(taskId: TaskId): Task? {
        return transaction {
            TaskDataSource.find { TaskMapper.id eq taskId.value }.firstOrNull()?.asTask()
        }
    }

    override fun findAllByUserId(userId: UserId): List<Task> {
        val tasks = mutableListOf<Task>()

        val userDataSource = transaction {
            UserDataSource.find { UserMapper.id eq userId.value }.firstOrNull()
        } ?: return tasks

        val user = userDataSource.asUser()

        transaction {
            userDataSource.tasks.map { it.asTask() }.forEach { task ->
                tasks.add(Task(task.id, user.id, task.name))
            }
        }

        return tasks
    }

    override fun remove(taskId: TaskId) {
        transaction {
            TaskDataSource.find { TaskMapper.id eq taskId.value }.firstOrNull()?.delete()
        }
    }
}
