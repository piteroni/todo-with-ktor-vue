package io.github.piteroni.todoktorvue.app.http.config

import io.github.piteroni.todoktorvue.app.utils.Config
import io.ktor.http.HttpMethod

class CORSConfig {
    val allowMethods: Collection<HttpMethod> = setOf(
        HttpMethod.Get,
        HttpMethod.Head,
        HttpMethod.Options,
        HttpMethod.Post,
        HttpMethod.Put,
        HttpMethod.Delete,
        HttpMethod.Patch,
    )

    val allowHosts: Collection<String> = Config.get("ALLOW_HOSTS").split(" ")
}
