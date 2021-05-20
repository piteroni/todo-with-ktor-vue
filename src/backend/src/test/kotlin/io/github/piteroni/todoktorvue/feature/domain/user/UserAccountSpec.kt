package io.github.piteroni.todoktorvue.feature.domain.user

import io.github.piteroni.todoktorvue.app.domain.user.UserAccount
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class UserAccountSpec : DescribeSpec({
    describe("UserAccount") {
        it("UserAccountインスタンスを生成することができる") {
            val userAccount = UserAccount.of(100, "user@example.com", "password")

            userAccount.id shouldBe 100
            userAccount.email shouldBe "user@example.com"
            userAccount.password shouldBe "password"
        }
    }
})
