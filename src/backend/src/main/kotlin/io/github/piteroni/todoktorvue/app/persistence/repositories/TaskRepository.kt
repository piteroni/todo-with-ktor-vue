package io.github.piteroni.todoktorvue.app.persistence.repositories

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.persistence.models.Task as TaskDataSource
import io.github.piteroni.todoktorvue.app.persistence.models.Tasks as TaskMapper
import io.github.piteroni.todoktorvue.app.persistence.models.User as UserDataSource
import io.github.piteroni.todoktorvue.app.persistence.models.Users as UserMapper
import io.github.piteroni.todoktorvue.app.domain.task.ITaskRepository
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.persistence.models.Tasks
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.joda.time.DateTime
import javax.sql.DataSource

class TaskRepository : ITaskRepository {
    override fun save(task: Task): Task {
        val author = transaction {
            UserDataSource.find { UserMapper.id eq task.userAccountId.value }.firstOrNull()
        } ?: return task

        val now = DateTime.now()

        val dataSource = if (task.taskId == TaskId.unregistered()) {
            transaction {
                TaskDataSource.new {
                    name = task.name
                    user = author
                    createdAt = now
                    updatedAt = now
                }
            }
        } else {
            transaction {
                val taskId = TaskMapper.update({ TaskMapper.id eq task.taskId.value }) {
                    it[name] = task.name
                    it[updatedAt] = now
                }

                TaskDataSource.find { TaskMapper.id eq taskId }.first()
            }
        }

        return Task.of(dataSource.id.value, author.asUserAccount().id, dataSource.name)
    }

    override fun findAllByUserId(userId: Int): List<Task> {
        val tasks = mutableListOf<Task>()

        val user = UserDataSource.find { UserMapper.id eq userId }.firstOrNull() ?: return tasks

        user.tasks.forEach { task ->
            tasks.add(Task.of(task.id.value, user.asUserAccount().id, task.name))
        }

        return tasks
    }

    override fun remove(taskId: Int) {
        transaction {
            TaskDataSource.find { Tasks.id eq taskId }.firstOrNull()?.delete()
        }
    }
}
