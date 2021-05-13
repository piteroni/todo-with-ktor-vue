package io.github.piteroni.todoktorvue.test.factories

import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.serpro69.kfaker.Faker
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
    ): User {
        return transaction {
            User.new {
                this.name = name ?: faker.name.name()
                this.email = email ?: faker.address.mailbox()
                this.password = hashpw(password ?: "password", gensalt())
                this.createdAt = createdAt ?: DateTime.now()
                this.updatedAt = updatedAt ?: DateTime.now()
            }
        }
    }
}
