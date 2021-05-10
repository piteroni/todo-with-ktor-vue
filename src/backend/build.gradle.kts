import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("application")
    id("com.github.johnrengelman.shadow") version "6.1.0"
    id("org.jlleitschuh.gradle.ktlint") version "10.0.0"
    kotlin("jvm") version "1.5.0"
    kotlin("plugin.serialization") version "1.5.0"
}

apply("migration.gradle")
apply(plugin = "org.jlleitschuh.gradle.ktlint")

java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
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
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "11"
    }
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}
