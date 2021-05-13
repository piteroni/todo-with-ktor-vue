package io.github.piteroni.todoktorvue.app.persistence.models

import io.github.piteroni.todoktorvue.app.domain.user.UserAccount
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable

object Users : IntIdTable("users") {
    val name = varchar("name", 256)
    val email = varchar("email", 256).uniqueIndex()
    val password = varchar("password", 1024)
    val createdAt = datetime("created_at").nullable()
    val updatedAt = datetime("updated_at").nullable()
}

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)

    var name by Users.name
    var email by Users.email
    var password by Users.password
    var createdAt by Users.createdAt
    var updatedAt by Users.updatedAt

    fun asUserAccount() = UserAccount(id.value, email, password)
}
