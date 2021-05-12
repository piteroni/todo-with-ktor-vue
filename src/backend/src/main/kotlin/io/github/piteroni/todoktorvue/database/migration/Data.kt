package io.github.piteroni.todoktorvue.database.migration

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt

internal fun insert() {
    val now = DateTime.now()

    transaction {
        Users.insert { user ->
            user[name] = "User"
            user[email] = "user@example.com"
            user[password] = BCrypt.hashpw("password1!", BCrypt.gensalt())
            user[createdAt] = now
            user[updatedAt] = now
        }

        Users.insert { user ->
            user[name] = "OtherUser"
            user[email] = "other-user@example.com"
            user[password] = BCrypt.hashpw("password1!", BCrypt.gensalt())
            user[createdAt] = now
            user[updatedAt] = now
        }
    }
}
