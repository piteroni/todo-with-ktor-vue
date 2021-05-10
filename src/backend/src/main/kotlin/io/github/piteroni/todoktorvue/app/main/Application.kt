package io.github.piteroni.todoktorvue.app.main

import io.ktor.application.Application

fun Application.main() {
    connectToDatabase()
    applyMiddlewares()
    applyRoutes()
}
