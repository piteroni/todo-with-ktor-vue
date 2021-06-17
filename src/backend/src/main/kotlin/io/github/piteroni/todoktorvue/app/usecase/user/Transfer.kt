package io.github.piteroni.todoktorvue.app.usecase.user

class AuthenticationException(message: String) : Exception(message)

class AuthenticateInputDataException(message: String) : Exception(message)

data class AuthenticateInputData(val email: String, val password: String)
