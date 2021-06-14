package io.github.piteroni.todoktorvue.app.presentation.boot

import io.ktor.application.Application

fun Application.main() {
    connectToDatabase()
    applyMiddlewares()
    applyRoutes()
}
