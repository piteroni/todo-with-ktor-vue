package io.github.piteroni.todoktorvue.feature.usecase.identification

import io.github.piteroni.todoktorvue.app.usecase.identification.Authentication
import io.github.piteroni.todoktorvue.app.usecase.identification.AuthenticationException
import io.github.piteroni.todoktorvue.testing.factories.UserFactory
import io.github.piteroni.todoktorvue.testing.setUp
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.startWith

class AuthenticationSpec : DescribeSpec({
    val authentication = Authentication()

    beforeTest {
        setUp()
    }

    describe("ユーザーアカウント認証機能") {
        it("登録済みのユーザーアカウントのアカウント情報を渡すと、認証されたアカウントのアカウントIDを取得できる") {
            val registeredUser = UserFactory.make(email = "registered-user@example.com", password = "registered-user-password")

            val authedUserAccountId = authentication.authenticate("registered-user@example.com", "registered-user-password")

            authedUserAccountId shouldBe registeredUser.id.value
        }

        it("引数に渡したメールアドレスに一致するユーザーアカウントが存在しない場合、例外が送出される") {
            val exception = shouldThrow<AuthenticationException> {
                authentication.authenticate("unregistered-user@example.com", "unregistered-user-password")
            }

            exception.message shouldBe startWith("there is no user matching")
        }

        it("指定したメールアドレスに一致するユーザーアカウントのパスワードと引数に渡したパスワードが一致しない場合、例外が送出される") {
            val exception = shouldThrow<AuthenticationException> {
                authentication.authenticate("registered-user@example.com", "incorrect-password")
            }

            exception.message shouldBe startWith("password is wrong")
        }
    }
})
