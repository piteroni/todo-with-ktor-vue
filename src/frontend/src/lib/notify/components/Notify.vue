<template>
  <div>
    <message-notify />
    <page-notify />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { bus, event } from "@/lib/notify/lib"
import MessageNotify from "./MessageNotify.vue"
import PageNotify from "./PageNotify.vue"

@Component({
  components: {
    "message-notify": MessageNotify,
    "page-notify": PageNotify
  }
})
export default class Notify extends Vue {
  public mounted(): void {
    this.$nextTick(() => {
      bus.$emit(event.componentMounted)
    })
  }
}
</script>
