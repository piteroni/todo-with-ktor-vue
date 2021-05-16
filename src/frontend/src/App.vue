<template>
  <v-app>
    <router-view />
    <notify />
    <error-over-rap />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import ErrorOverRap from "@/pages/Error/InternalServerError.vue"
import Notify from "@/lib/notify/Container.vue"

@Component({
  components: {
    "notify": Notify,
    "error-over-rap": ErrorOverRap
  }
})
export default class App extends Vue {
}
</script>
