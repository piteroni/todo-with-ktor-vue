package io.github.piteroni.todoktorvue.migration

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

fun migrate() {
    transaction {
        addLogger(StdOutSqlLogger)

        SchemaUtils.create(Users)
        SchemaUtils.createMissingTablesAndColumns(Users)
    }
}

fun main() {
    connect()
    migrate()
    insert()
}
