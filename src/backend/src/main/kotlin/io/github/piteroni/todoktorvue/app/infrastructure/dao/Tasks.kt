package io.github.piteroni.todoktorvue.app.infrastructure.dao

import io.github.piteroni.todoktorvue.app.domain.task.Task
import io.github.piteroni.todoktorvue.app.domain.task.TaskId
import io.github.piteroni.todoktorvue.app.domain.task.TaskName
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable
import org.jetbrains.exposed.sql.CurrentDateTime

object TaskMapper : IntIdTable("tasks") {
    val name = varchar("name", 256)
    val user = reference("users", UserMapper)
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime())
    val updatedAt = datetime("updated_at").defaultExpression(CurrentDateTime())
}

class TaskDataSource(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<TaskDataSource>(TaskMapper)

    var name by TaskMapper.name
    var user by UserDataSource referencedOn TaskMapper.user
    var createdAt by TaskMapper.createdAt
    var updatedAt by TaskMapper.updatedAt

    fun asTask(): Task = Task(TaskId(id.value), user.asUser().id, TaskName(name))
}
