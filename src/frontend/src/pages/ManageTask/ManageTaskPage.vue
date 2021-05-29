<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo />

          <v-spacer />
          <more-menu />
        </navbar>

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
import { Service, VuexContext } from "@/providers/containers"
import { Redirector } from "@/lib/middleware/Redirector"
import { RetainedTaskListContext } from "@/store/modules/retainedTaskList"
import Navbar from "@/components/singletons/Navber.vue"
import Logo from "@/components/singletons/Logo.vue"
import Loading from "@/components/singletons/Loading.vue"
import MoreMenu from "@/components/singletons/MoreMenu.vue"

@Component({
  components: {
    "logo": Logo,
    "navbar": Navbar,
    "loading": Loading,
    "more-menu": MoreMenu,
  }
})
export default class ManageTaskPage extends Vue {
  @VuexContext(types.vuexContext.retainedTaskList)
  private $retainedTaskList!: RetainedTaskListContext

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

    await this.$retainedTaskList.actions.fetch()

    this.loading = false
  }
}
</script>

<style>

</style>
