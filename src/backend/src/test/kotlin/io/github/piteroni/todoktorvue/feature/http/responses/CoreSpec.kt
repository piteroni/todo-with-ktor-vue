package io.github.piteroni.todoktorvue.feature.http.responses

import io.github.piteroni.todoktorvue.app.http.responses.SimpleResponse
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe

class CoreSpec : DescribeSpec({
    describe("SimpleResponse") {
        it("メッセージを指定すると、渡した値を取得できる") {
            val response = SimpleResponse("message")

            response.message shouldBe "message"
        }
    }
})
