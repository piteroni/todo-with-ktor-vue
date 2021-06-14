package io.github.piteroni.todoktorvue.migration

import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskDataSource
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserDataSource
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

internal fun insert() {
    transaction {
        val author = UserDataSource.new {
            name = "User"
            email = "user@example.com"
            password = BCrypt.hashpw("password1!", BCrypt.gensalt())
        }

        TaskDataSource.new {
            name = "task-0"
            user = author
        }
    }

    transaction {
        val others = UserDataSource.new {
            name = "Others"
            email = "others@example.com"
            password = BCrypt.hashpw("password1!", BCrypt.gensalt())
        }

        TaskDataSource.new {
            name = "others-task-0"
            user = others
        }
    }
}
