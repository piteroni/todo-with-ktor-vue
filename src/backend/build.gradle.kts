import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("application")
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
    // spek
    testImplementation("org.spekframework.spek2:spek-dsl-jvm:2.0.10")
    testRuntimeOnly("com.h2database:h2:1.4.200")
    testRuntimeOnly("org.spekframework.spek2:spek-runner-junit5:2.0.10")
    testRuntimeOnly("org.jetbrains.kotlin:kotlin-reflect:1.4.32")
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
    useJUnitPlatform {
        includeEngines("spek2")
    }

    testLogging {
        showStandardStreams = true
    }
}

tasks.withType<ShadowJar> {
    isZip64 = true
}

task<JavaExec>("drop") {
    classpath = project.the<SourceSetContainer>()["main"].runtimeClasspath
    main = "io.github.piteroni.todoktorvue.database.migration.DropKt"
}

task<JavaExec>("migrate") {
    classpath = project.the<SourceSetContainer>()["main"].runtimeClasspath
    main = "io.github.piteroni.todoktorvue.database.migration.MigrationKt"
}

task<ShadowJar>("testShadowJar") {
    archiveClassifier.set("tests")

    configurations = listOf(project.configurations.testImplementation.get().apply { isCanBeResolved = true })

    from(project.the<SourceSetContainer>()["test"].output)
}
