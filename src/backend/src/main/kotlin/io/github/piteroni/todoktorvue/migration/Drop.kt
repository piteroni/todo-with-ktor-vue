package io.github.piteroni.todoktorvue.migration

import io.github.piteroni.todoktorvue.app.persistence.models.Tasks
import io.github.piteroni.todoktorvue.app.persistence.models.Users
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

fun drop() {
    transaction {
        addLogger(StdOutSqlLogger)

        SchemaUtils.drop(Tasks)
        SchemaUtils.drop(Users)
    }
}

fun main() {
    connect()
    drop()
}
