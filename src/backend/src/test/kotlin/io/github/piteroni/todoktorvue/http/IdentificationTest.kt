package io.github.piteroni.todoktorvue.http

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.auth.jwt.makeJWTConfig
import io.github.piteroni.todoktorvue.app.main.main
import io.github.piteroni.todoktorvue.testing.factories.UserFactory
import io.github.piteroni.todoktorvue.testing.internalApi
import io.github.piteroni.todoktorvue.testing.setUp
import io.kotest.core.spec.style.AnnotationSpec
import io.kotest.matchers.shouldBe
import io.ktor.application.Application
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.every
import io.mockk.mockk

class IdentificationTest : AnnotationSpec() {
    private val jwt = mockk<JWT>(relaxed = true)
    private val user = UserFactory.make(email = "user@example.com", password = "password1!")

    @BeforeAll
    fun beforeEach() {
        setUp()

        every { jwt.createToken(user.id.value, makeJWTConfig()) } returns "token"
    }

    @Test
    fun `200 - User account authentication`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"email": "user@example.com", "password": "password1!"}""")
        }.apply {
            response.status() shouldBe HttpStatusCode.OK
            response.content shouldBe "token"
        }
    }
}
