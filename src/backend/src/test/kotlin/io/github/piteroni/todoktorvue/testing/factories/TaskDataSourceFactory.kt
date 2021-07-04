package io.github.piteroni.todoktorvue.testing.factories

import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import io.github.serpro69.kfaker.Faker
import org.jetbrains.exposed.sql.transactions.transaction

object TaskDataSourceFactory {
    private val faker = Faker()

    fun make(
        user: UserDataSource,
        name: String? = null,
    ): TaskDataSource {
        return transaction {
            TaskDataSource.new {
                this.user = user
                this.name = name ?: faker.name.name()
            }
        }
    }
}

class TaskDataSourceFactory2 {
    private val faker = Faker()

    private var count = 1

    fun count(count: Int): TaskDataSourceFactory2 {
        this.count = count

        return this
    }

    fun make(
        user: UserDataSource,
        name: String? = null,
    ): List<TaskDataSource> {
        val index = 1
        val range = index..count

        return transaction {
            range.map {
                TaskDataSource.new {
                    this.user = user
                    this.name = name ?: faker.name.name()
                }
            }
        }
    }
}
