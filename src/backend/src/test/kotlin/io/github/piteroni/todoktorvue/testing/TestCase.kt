package io.github.piteroni.todoktorvue.testing

import io.github.piteroni.todoktorvue.migration.connect
import io.github.piteroni.todoktorvue.migration.migrate
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction

fun setUp() {
    connect()
    migrate()
}

fun refresh() {
    transaction {
        val db = TransactionManager.current().db
        val connector = db.connector()

        connector.createStatement().execute("SET FOREIGN_KEY_CHECKS=0")

        db.dialect.allTablesNames().forEach {
            connector.createStatement().execute("TRUNCATE TABLE $it")
        }

        connector.createStatement().execute("SET FOREIGN_KEY_CHECKS=1")
    }
}

fun internalApi(path: String): String = "/api/i/v0/${path.replace("^/".toRegex(), "")}"
