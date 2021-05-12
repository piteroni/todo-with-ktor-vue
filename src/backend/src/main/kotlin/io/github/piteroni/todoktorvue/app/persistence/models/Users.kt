package io.github.piteroni.todoktorvue.app.persistence.models

import org.jetbrains.exposed.dao.*

object Users : IntIdTable("users") {
    val name = varchar("name", 256)
    val email = varchar("email", 256).uniqueIndex()
    val password = varchar("password", 1024)
    val createdAt = datetime("created_at").nullable()
    val updatedAt = datetime("updated_at").nullable()
}

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)

    val name by Users.name
    val email by Users.email
    val password by Users.password
    val createdAt by Users.createdAt
    val updatedAt by Users.updatedAt
}
