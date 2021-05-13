package io.github.piteroni.todoktorvue.test

import io.github.piteroni.todoktorvue.migration.connect
import io.github.piteroni.todoktorvue.migration.migrate

fun setUp() {
    connect()
    migrate()
}
