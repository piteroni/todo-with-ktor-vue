package io.github.piteroni.todoktorvue.http

import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.main.main
import io.github.piteroni.todoktorvue.testing.factories.UserFactory
import io.github.piteroni.todoktorvue.testing.internalApi
import io.github.piteroni.todoktorvue.testing.setUp
import io.kotest.core.spec.style.AnnotationSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.startWith
import io.ktor.application.Application
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.*
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkConstructor

class IdentificationTest : AnnotationSpec() {
    private val user = UserFactory.make(email = "user@example.com", password = "password1!")

    @BeforeAll
    fun beforeEach() {
        setUp()

        mockkConstructor(JWT::class).also {
            every { anyConstructed<JWT>().createToken(user.id.value) } returns "api-token"
        }
    }

    @Test
    fun `200 - User account authentication`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"email": "user@example.com", "password": "password1!"}""")
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.OK
            response.content shouldBe """{"token":"api-token"}"""
        }
    }
}
