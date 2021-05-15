package io.github.piteroni.todoktorvue.feature.http.requests

import io.github.piteroni.todoktorvue.app.http.requests.LoginRequest
import io.github.piteroni.todoktorvue.app.http.requests.RequestValidationException
import io.kotest.assertions.throwables.shouldNotThrow
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.startWith

class IdentificationRequestsSpec : DescribeSpec({
    describe("LoginRequest") {
        it("メールアドレスとパスワードを指定すると、渡した値を取得できる") {
            val request = LoginRequest("user@example.com", "password")

            request.email shouldBe "user@example.com"
            request.password shouldBe "password"
        }

        it("メールアドレスとパスワードの検証を実施できる") {
            val request = LoginRequest("user@example.com", "password")

            shouldNotThrow<RequestValidationException> {
                request.validate()
            }
        }

        it("空のメールアドレスを渡すと、例外が送出される") {
            val request = LoginRequest("", "password")

            val exception = shouldThrow<RequestValidationException> {
                request.validate()
            }

            exception.message shouldBe startWith("Illegal email size, must be between 0-256")
        }

        it("257文字以上のメールアドレスを渡すと、例外が送出される") {
            val request = LoginRequest("0".repeat(257), "password")

            val exception = shouldThrow<RequestValidationException> {
                request.validate()
            }

            exception.message shouldBe startWith("Illegal email size, must be between 0-256")
        }

        it("空のパスワードを渡すと、例外が送出される") {
            val request = LoginRequest("user@example.com", "")

            val exception = shouldThrow<RequestValidationException> {
                request.validate()
            }

            exception.message shouldBe startWith("Illegal password size, must be between 0-128")
        }

        it("257文字以上のパスワードを渡すと、例外が送出される") {
            val request = LoginRequest("user@example.com", "0".repeat(257))

            val exception = shouldThrow<RequestValidationException> {
                request.validate()
            }

            exception.message shouldBe startWith("Illegal password size, must be between 0-128")
        }
    }
})
