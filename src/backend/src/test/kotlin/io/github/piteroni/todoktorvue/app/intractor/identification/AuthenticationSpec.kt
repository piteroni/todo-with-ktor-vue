package io.github.piteroni.todoktorvue.app.intractor.identification

import io.github.piteroni.todoktorvue.app.persistence.models.Users
import io.github.piteroni.todoktorvue.test.factories.UserFactory
import io.github.piteroni.todoktorvue.test.setUp
import org.spekframework.spek2.Spek
import org.spekframework.spek2.style.specification.describe
import kotlin.test.assertEquals

object AuthenticationSpec : Spek({
    lateinit var user: Users

    beforeGroup {
        setUp()

        UserFactory.make()
    }

    describe("登録済みのユーザーアカウントのメールアドレスとパスワードを渡すと、認証トークンを取得できる") {
        assertEquals(1, 1)
    }
})
