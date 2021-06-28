package io.github.piteroni.todoktorvue.usecase.user

import io.github.piteroni.todoktorvue.app.domain.user.Email
import io.github.piteroni.todoktorvue.app.domain.user.HashedPassword
import io.github.piteroni.todoktorvue.app.domain.user.User
import io.github.piteroni.todoktorvue.app.domain.user.UserAccount
import io.github.piteroni.todoktorvue.app.domain.user.UserId
import io.github.piteroni.todoktorvue.app.domain.user.UserRepository
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticateInputData
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticateInputDataException
import io.github.piteroni.todoktorvue.app.usecase.user.AuthenticationException
import io.github.piteroni.todoktorvue.app.usecase.user.UserUseCase
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult
import io.kotest.matchers.shouldBe
import io.mockk.clearAllMocks
import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.mindrot.jbcrypt.BCrypt

class UserUseCaseTest : DescribeSpec() {
    private val userRepository = mockk<UserRepository>()
    private val userUseCase = UserUseCase(userRepository)

    override fun afterEach(testCase: TestCase, result: TestResult) {
        clearAllMocks()
    }

    init {
        describe("ユーザーアカウント認証処理") {
            it("認証に必要な情報を渡すと、ユーザーアカウント認証が行われる") {
                val userId = 87
                val email = "user@example.com"
                val password = "password1!"
                val hashed = BCrypt.hashpw(password, BCrypt.gensalt())
                val user = User(UserId(userId), UserAccount(Email(email), HashedPassword(hashed)))
                val inputData = AuthenticateInputData(email, password)

                every { userRepository.findByEmail(Email("user@example.com")) } returns user

                val authenticatedUserId = userUseCase.authenticate(inputData)

                authenticatedUserId shouldBe userId
                verify(exactly = 1) { userRepository.findByEmail(Email("user@example.com")) }
                confirmVerified(userRepository)
            }
        }

        it("ドメインに従わない入力データを渡すと例外が送出される") {
            val inputData = AuthenticateInputData("", "password1!")

            shouldThrow<AuthenticateInputDataException> {
                userUseCase.authenticate(inputData)
            }
        }

        it("入力情報に一致するユーザーがリポジトリ上に存在しない場合、例外が送出される") {
            val inputData = AuthenticateInputData("user@example.com", "password1!")

            every { userRepository.findByEmail(Email("user@example.com")) } returns null

            shouldThrow<AuthenticationException> {
                userUseCase.authenticate(inputData)
            }
        }

        it("リポジトリ上に存在するユーザーのパスワードと渡したパスワードが異なる場合、例外が送出される") {
            val userId = 87
            val email = "user@example.com"
            val password = "password1!"
            val incorrectPassword = "incorrect-password1!"
            val hashed = BCrypt.hashpw(password, BCrypt.gensalt())
            val user = User(UserId(userId), UserAccount(Email(email), HashedPassword(hashed)))
            val inputData = AuthenticateInputData(email, incorrectPassword)

            every { userRepository.findByEmail(Email(email)) } returns user

            shouldThrow<AuthenticationException> {
                userUseCase.authenticate(inputData)
            }

            verify(exactly = 1) { userRepository.findByEmail(Email(email)) }
            confirmVerified(userRepository)
        }
    }
}
