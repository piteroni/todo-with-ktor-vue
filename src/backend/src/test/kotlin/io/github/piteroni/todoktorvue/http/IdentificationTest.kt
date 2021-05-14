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
import io.ktor.http.*
import io.ktor.server.testing.contentType
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.*

class IdentificationTest : AnnotationSpec() {
    private val user = UserFactory.make(email = "user@example.com", password = "password1!")

    @BeforeAll
    fun beforeAll() {
        setUp()
    }

    @Test
    fun `200 - UserAccount authentication`() {
        mockkConstructor(JWT::class).also {
            every { anyConstructed<JWT>().createToken(user.id.value) } returns "api-token"
        }

        withTestApplication(Application::main) {
            handleRequest(HttpMethod.Post, internalApi("/login")) {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody("""{"email": "user@example.com", "password": "password1!"}""")
            }.apply {
                response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe """{"token":"api-token"}"""
            }
        }

        unmockkAll()
    }

    @Test
    fun `401 - Authentication fails`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"email": "unregisted-user@example.com", "password": "incorrect-pw"}""")
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.Unauthorized
        }
    }

    @Test
    fun `422 - Illegal content type`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.FormUrlEncoded.toString())
            setBody(listOf("email" to "user@example.com", "password" to "password1!").formUrlEncode())
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.UnprocessableEntity
        }
    }

    @Test
    fun `422 - Illegal request body keys`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"userId": "email@example.com", "password": "password1!"}""")
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.UnprocessableEntity
        }
    }

    @Test
    fun `422 - Illegal request body values`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"email": "user@example.com", "password": ""}""") // empty value.
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.UnprocessableEntity
        }
    }
}
