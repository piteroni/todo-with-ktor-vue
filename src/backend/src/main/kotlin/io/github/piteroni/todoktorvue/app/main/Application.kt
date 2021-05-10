package io.github.piteroni.todoktorvue.app.main

import io.ktor.application.Application
import io.ktor.routing.routing

fun Application.main() {
    connectToDatabase()
    applyMiddlewares()
    applyRoutes()
}