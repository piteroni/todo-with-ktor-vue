<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <div class="container">
          タスク管理画面
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
import Loading from "@/components/singletons/Loading.vue"

@Component({
  components: {
    "loading": Loading,
  }
})
export default class ManageTaskPage extends Vue {
  @Service(types.service.redirector)
  private $redirector!: Redirector

  /**
   * ローディング状態を保持する.
   */
  public loading = true

  public async mounted(): Promise<void> {
    const isRedirect = await this.$redirector.redirectIfUnauthenticated()

    if (isRedirect) {
      return
    }

    this.loading = false
  }
}
</script>

<style>

</style>
