package io.github.piteroni.todoktorvue.database.migration

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

fun main() {
    connect()

    transaction {
        addLogger(StdOutSqlLogger)

        SchemaUtils.create(Users)
        SchemaUtils.createMissingTablesAndColumns(Users)

        insert()
    }
}
