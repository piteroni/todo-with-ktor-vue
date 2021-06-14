package io.github.piteroni.todoktorvue.app.presentation.utils

import io.github.cdimascio.dotenv.Dotenv
import io.github.cdimascio.dotenv.dotenv

class UnknownPropertyException(message: String) : Exception(message)

object Config {
    private val env: Dotenv = dotenv()

    /**
     * @throws UnknownPropertyException
     */
    fun get(key: String): String = env[key] ?: throw UnknownPropertyException("$key property does not exist")
}
