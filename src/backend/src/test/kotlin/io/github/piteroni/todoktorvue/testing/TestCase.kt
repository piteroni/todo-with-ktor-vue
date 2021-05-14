package io.github.piteroni.todoktorvue.testing

import io.github.piteroni.todoktorvue.migration.connect
import io.github.piteroni.todoktorvue.migration.migrate

fun setUp() {
    connect()
    migrate()
}

fun internalApi(path: String): String = "/api/i/v0/${path.replace("^/".toRegex(), "")}"
