import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("application")
    id("jacoco")
    id("com.github.johnrengelman.shadow") version "6.1.0"
    id("org.jlleitschuh.gradle.ktlint") version "10.0.0"
    kotlin("jvm") version "1.4.32"
    kotlin("plugin.serialization") version "1.4.32"
}

apply {
    plugin("java")
    plugin("org.jlleitschuh.gradle.ktlint")
}

java.sourceCompatibility = JavaVersion.VERSION_1_8

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.4.32")
    // ktor
    implementation("io.ktor:ktor-server-core:1.5.3")
    implementation("io.ktor:ktor-server-netty:1.5.3")
    implementation("io.ktor:ktor-serialization:1.5.3")
    implementation("io.ktor:ktor-auth:1.5.3")
    implementation("io.ktor:ktor-auth-jwt:1.5.3")
    // database
    implementation("org.jetbrains.exposed:exposed:0.17.13")
    implementation("mysql:mysql-connector-java:8.0.18")
    // crypt
    implementation("org.mindrot:jbcrypt:0.4")
    // logging
    implementation("ch.qos.logback:logback-classic:0.9.26")
    // configuration
    implementation("io.github.cdimascio:dotenv-kotlin:6.2.2")

    // ktor
    testImplementation("io.ktor:ktor-server-tests:1.5.3")
    // faker
    testImplementation("io.github.serpro69:kotlin-faker:1.6.0")
    // mock
    testImplementation("io.mockk:mockk:1.10.6")
    // kotest
    testImplementation("io.kotest:kotest-runner-junit5:4.5.0")
    testImplementation("io.kotest:kotest-assertions-core:4.5.0")
    // serialization
    testImplementation("com.google.code.gson:gson:2.8.6")
    // in-memory db
    testRuntimeOnly("com.h2database:h2:1.4.200")
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()

    testLogging {
        showStandardStreams = true
    }
}

tasks.jacocoTestReport {
    reports {
        xml.isEnabled = true
        html.isEnabled = true
    }

    classDirectories.setFrom(
        fileTree(
            "dir" to "build/classes",
            "includes" to listOf(
                "**/piteroni/todoktorvue/app/domain/**",
                "**/piteroni/todoktorvue/app/usecase/**",
                "**/piteroni/todoktorvue/app/main/Route*",
                "**/piteroni/todoktorvue/app/http/requests/**",
                "**/piteroni/todoktorvue/app/http/responses/**",
                "**/piteroni/todoktorvue/app/http/controllers/**"
            ),
            "excludes" to listOf(
                "**/*Spec*",
                "**/*Test*",
                "**/*serializer*"
            )
        )
    )
}

tasks.withType<ShadowJar> {
    isZip64 = true
}

task<JavaExec>("drop") {
    classpath = project.the<SourceSetContainer>()["main"].runtimeClasspath
    main = "io.github.piteroni.todoktorvue.migration.DropKt"
}

task<JavaExec>("migrate") {
    classpath = project.the<SourceSetContainer>()["main"].runtimeClasspath
    main = "io.github.piteroni.todoktorvue.migration.MigrationKt"
}

task<ShadowJar>("testShadowJar") {
    archiveClassifier.set("tests")

    configurations = listOf(project.configurations.testImplementation.get().apply { isCanBeResolved = true })

    from(project.the<SourceSetContainer>()["test"].output)
}
