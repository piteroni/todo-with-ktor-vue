package io.github.piteroni.todoktorvue.app.presentation.boot

import io.github.piteroni.todoktorvue.app.presentation.exceptions.InternalServerErrorException
import io.github.piteroni.todoktorvue.app.presentation.utils.Config
import org.jetbrains.exposed.sql.Database

/**
 * @throws InternalServerErrorException
 */
fun connectToDatabase() {
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
