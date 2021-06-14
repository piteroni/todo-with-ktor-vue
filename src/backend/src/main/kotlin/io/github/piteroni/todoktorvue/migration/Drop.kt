package io.github.piteroni.todoktorvue.migration

import io.github.piteroni.todoktorvue.app.infrastructure.dao.TaskMapper
import io.github.piteroni.todoktorvue.app.infrastructure.dao.UserMapper
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

fun drop() {
    transaction {
        addLogger(StdOutSqlLogger)

        SchemaUtils.drop(TaskMapper)
        SchemaUtils.drop(UserMapper)
    }
}

fun main() {
    connect()
    drop()
}
