<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout class="manageTask" v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo />

          <v-spacer />
          <more-menu />
        </navbar>

        <v-container fluid class="mx-12">
          <task-create-form />
          <task-list />
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { types } from "@/providers/types"
import { Service, VuexContext } from "@/providers/containers"
import { Redirector } from "@/lib/middleware/Redirector"
import { RetainedTaskContext } from "@/store/modules/retainedTask"
import Navbar from "@/components/singletons/Navber.vue"
import Logo from "@/components/singletons/Logo.vue"
import Loading from "@/components/singletons/Loading.vue"
import MoreMenu from "@/components/singletons/MoreMenu.vue"
import TaskList from "./TaskList.vue"
import TaskCreateForm from "./TaskCreateForm.vue"

@Component({
  components: {
    "logo": Logo,
    "navbar": Navbar,
    "loading": Loading,
    "more-menu": MoreMenu,
    "task-list": TaskList,
    "task-create-form": TaskCreateForm
  }
})
export default class ManageTaskPage extends Vue {
  @VuexContext(types.vuexContext.retainedTask)
  private $retainedTask!: RetainedTaskContext

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

    try {
      await this.$retainedTask.actions.fetchTasks()
    } catch (e) {
      console.error(e)
      this.$notify.fatal()

      return
    }

    this.loading = false
  }
}
</script>
