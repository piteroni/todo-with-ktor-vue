package io.github.piteroni.todoktorvue.migration

import io.github.piteroni.todoktorvue.app.persistence.models.Task
import io.github.piteroni.todoktorvue.app.persistence.models.User
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt

internal fun insert() {
    val now = DateTime.now()

    transaction {
        val author = User.new {
            name = "User"
            email = "user@example.com"
            password = BCrypt.hashpw("password1!", BCrypt.gensalt())
            createdAt = now
            updatedAt = now
        }

        Task.new {
            name = "task-0"
            user = author
            createdAt = now
            updatedAt = now
        }
    }
}
