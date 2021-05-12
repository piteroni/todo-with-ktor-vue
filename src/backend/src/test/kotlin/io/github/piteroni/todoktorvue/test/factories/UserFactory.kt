package io.github.piteroni.todoktorvue.test.factories

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.serpro69.kfaker.Faker
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt.gensalt
import org.mindrot.jbcrypt.BCrypt.hashpw

object UserFactory {
    private val faker = Faker()

    fun make(
        name: String? = null,
        email: String? = null,
        password: String? = null,
        createdAt: DateTime? = null,
        updatedAt: DateTime? = null,
    ): InsertStatement<Number> {
        return transaction {
            Users.insert { user ->
                user[Users.name] = name ?: faker.name.name()
                user[Users.email] = email ?: faker.address.mailbox()
                user[Users.password] = password ?: hashpw("password", gensalt())
                user[Users.createdAt] = createdAt ?: DateTime.now()
                user[Users.updatedAt] = updatedAt ?: DateTime.now()
            }
        }
    }
}
