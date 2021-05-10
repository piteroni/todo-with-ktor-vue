package io.github.piteroni.todoktorvue.database.migration

import io.github.piteroni.todoktorvue.app.utils.Config
import org.jetbrains.exposed.sql.Database

/**
 * connect to database.
 */
internal fun connect() {
    Database.connect(
        url = Config.get("DB_URL"),
        driver = Config.get("DB_DRIVER"),
        user = Config.get("DB_USERNAME"),
        password = Config.get("DB_PASSWORD")
    )
}