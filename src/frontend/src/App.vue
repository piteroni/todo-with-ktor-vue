<template>
  <v-app>
    <router-view />
    <notify />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import Notify from "@/lib/notify/components/Notify.vue"

@Component({
  components: {
    "notify": Notify,
  }
})
export default class App extends Vue {
}
</script>
