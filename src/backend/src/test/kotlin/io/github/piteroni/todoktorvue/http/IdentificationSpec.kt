package io.github.piteroni.todoktorvue.http

import com.google.gson.Gson
import io.github.piteroni.todoktorvue.app.auth.jwt.JWT
import io.github.piteroni.todoktorvue.app.main.main
import io.github.piteroni.todoktorvue.app.persistence.models.User
import io.github.piteroni.todoktorvue.testing.HttpTestCase
import io.github.piteroni.todoktorvue.testing.factories.UserFactory
import io.github.piteroni.todoktorvue.testing.internalApi
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.startWith
import io.ktor.application.Application
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.formUrlEncode
import io.ktor.server.testing.contentType
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.every
import io.mockk.mockkConstructor
import io.mockk.unmockkAll

class IdentificationSpec : HttpTestCase() {
    private lateinit var user: User

    private val gson = Gson()

    @BeforeEach
    fun beforeEach() {
        user = UserFactory.make(email = "user@example.com", password = "password1!")
    }

    @Test
    fun `200 - UserAccount authentication`() {
        mockkConstructor(JWT::class).also {
            every { anyConstructed<JWT>().createToken(user.id.value) } returns "api-token"
        }

        withTestApplication(Application::main) {
            handleRequest(HttpMethod.Post, internalApi("/login")) {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(mapOf("email" to "user@example.com", "password" to "password1!").let { gson.toJson(it) })
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
            setBody(mapOf("email" to "unregisted-user@example.com", "password" to "incorrect-pw").let { gson.toJson(it) })
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
            setBody(mapOf("userId" to "email@example.com", "password" to "password1!").let { gson.toJson(it) })
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.UnprocessableEntity
        }
    }

    @Test
    fun `422 - Illegal request body values`() = withTestApplication(Application::main) {
        handleRequest(HttpMethod.Post, internalApi("/login")) {
            addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            // empty value.
            setBody(mapOf("email" to "email@example.com", "password" to "").let { gson.toJson(it) })
        }.apply {
            response.contentType().toString() shouldBe startWith(ContentType.Application.Json.toString())
            response.status() shouldBe HttpStatusCode.UnprocessableEntity
        }
    }
}
