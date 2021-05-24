package io.github.piteroni.todoktorvue.app.persistence.models

import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable
import io.github.piteroni.todoktorvue.app.domain.task.Task as TaskEntity

object Tasks : IntIdTable("tasks") {
    val name = varchar("name", 256)
    val user = reference("users", Users)
    val createdAt = datetime("created_at").nullable()
    val updatedAt = datetime("updated_at").nullable()
}

class Task(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Task>(Tasks)

    var name by Tasks.name
    var user by User referencedOn Tasks.user
    var createdAt by Tasks.createdAt
    var updatedAt by Tasks.updatedAt

    fun asEntity(): TaskEntity = TaskEntity(id.value, name)
}
