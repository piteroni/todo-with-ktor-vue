package io.github.piteroni.todoktorvue.feature.http.responses

import io.github.piteroni.todoktorvue.app.http.responses.AuthenticationToken
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class IdentificationResponsesSpec : DescribeSpec({
    describe("AuthenticationToken") {
        it("認証トークンを指定すると、渡した値を取得できる") {
            val authenticationToken = AuthenticationToken("jwt-token")

            authenticationToken.token shouldBe "jwt-token"
        }
    }
})
