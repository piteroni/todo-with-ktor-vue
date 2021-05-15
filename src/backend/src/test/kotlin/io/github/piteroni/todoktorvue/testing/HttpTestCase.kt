package io.github.piteroni.todoktorvue.testing

import io.kotest.core.spec.style.AnnotationSpec

abstract class HttpTestCase : AnnotationSpec() {
    @BeforeAll
    fun beforeAll() {
        setUp()
    }

    @AfterEach
    fun afterEach() {
        refresh()
    }
}
