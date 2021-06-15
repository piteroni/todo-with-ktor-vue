package io.github.piteroni.todoktorvue.app.infrastructure.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.domain.task.TaskRepository as ITaskRepository
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserMapper
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskMapper
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.joda.time.DateTime

class TaskRepository : ITaskRepository {
    override fun save(task: Task): Task {
        val userDataSource = transaction {
            UserDataSource.find { UserMapper.id eq task.userId.value }.firstOrNull()
        } ?: return task

        return if (task.id == TaskId.unregistered()) {
            transaction {
                TaskDataSource.new {
                    name = task.name.value
                    user = userDataSource
                }.asTask()
            }
        } else {
            transaction {
                val taskId = TaskMapper.update({ TaskMapper.id eq task.id.value }) {
                    it[name] = task.name.value
                    it[updatedAt] = DateTime.now()
                }

                TaskDataSource.find { TaskMapper.id eq taskId }.first().asTask()
            }
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
            userDataSource.tasks.map{ it.asTask() }.forEach { task ->
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
