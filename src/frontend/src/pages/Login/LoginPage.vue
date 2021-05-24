<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo />
        </navbar>

        <div class="container">
          <login-form />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { types } from "@/providers/types"
import { Service } from "@/providers/containers"
import { Redirector } from "@/lib/middleware/Redirector"
import Navbar from "@/components/singletons/Navber.vue"
import Logo from "@/components/singletons/Logo.vue"
import Loading from "@/components/singletons/Loading.vue"
import LoginForm from "./LoginForm.vue"

@Component({
  components: {
    "logo": Logo,
    "navbar": Navbar,
    "loading": Loading,
    "login-form": LoginForm,
  }
})
export default class LoginPage extends Vue {
  @Service(types.service.redirector)
  private $redirector!: Redirector

  /**
   * ローディング状態を保持する.
   */
  public loading = true

  public async mounted(): Promise<void> {
    const isRedirect = await this.$redirector.redirectIfAuthenticated()

    if (isRedirect) {
      return
    }

    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 50px;
}
</style>
