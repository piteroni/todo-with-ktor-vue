package io.github.piteroni.todoktorvue.app.persistence.models

import org.jetbrains.exposed.dao.IntIdTable

object Users : IntIdTable("users") {
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 1024)
    val createdAt = datetime("created_at").nullable()
    val updatedAt = datetime("updated_at").nullable()
}
