package io.github.piteroni.todoktorvue.test

import io.github.piteroni.todoktorvue.database.migration.connect
import io.github.piteroni.todoktorvue.database.migration.migrate

fun setUp() {
    connect()
    migrate()
}
