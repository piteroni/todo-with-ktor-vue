package io.github.piteroni.todoktorvue.testing

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.core.test.TestCase
import io.kotest.core.test.TestResult

abstract class HttpTestCase : DescribeSpec() {
    override fun beforeEach(testCase: TestCase) {
        setUp()
    }

    override fun afterEach(testCase: TestCase, result: TestResult) {
        refresh()
    }
}
