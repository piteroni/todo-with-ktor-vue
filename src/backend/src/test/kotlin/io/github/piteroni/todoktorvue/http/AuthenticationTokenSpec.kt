package io.github.piteroni.todoktorvue.http

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.main.main
import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.piteroni.todoktorvue.testing.HttpTestCase
import io.github.piteroni.todoktorvue.testing.factories.UserFactory
import io.github.piteroni.todoktorvue.testing.internalApi
import io.kotest.matchers.shouldBe
import io.ktor.application.Application
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.withTestApplication

class AuthenticationTokenSpec : HttpTestCase() {
    private lateinit var user: User

    @BeforeEach
    fun beforeEach() {
        user = UserFactory.make(email = "user@example.com", password = "password1!")
    }

    @Test
    fun `200 - When verified authentication token`() = withTestApplication(Application::main) {
        val token = JWT(makeJWTConfig()).createToken(user.id.value)

        handleRequest(HttpMethod.Post, internalApi("/credentials/verify")) {
            addHeader(HttpHeaders.Authorization, "Bearer $token")
        }.apply {
            response.status() shouldBe HttpStatusCode.OK
        }
    }

    @Test
    fun `401 - When illegal authentication token`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/credentials/verify")) {
            addHeader(HttpHeaders.Authorization, "Bearer illegal-token")
        }.apply {
            response.status() shouldBe HttpStatusCode.Unauthorized
        }
    }
}
