package io.github.piteroni.todoktorvue.app.main

import io.github.piteroni.todoktorvue.app.utils.Config
import io.github.piteroni.todoktorvue.app.http.exceptions.InternalServerErrorException
import org.jetbrains.exposed.sql.Database

/**
 * @throws InternalServerErrorException
 */
fun connectToDatabase(): Unit {
    try {
        Database.connect(
            url = Config.get("DB_URL"),
            driver = Config.get("DB_DRIVER"),
            user = Config.get("DB_USERNAME"),
            password = Config.get("DB_PASSWORD")
        )
    } catch (exception: Throwable) {
        throw InternalServerErrorException(exception)
    }
}
