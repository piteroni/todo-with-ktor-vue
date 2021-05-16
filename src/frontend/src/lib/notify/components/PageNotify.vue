<template>
  <div>
    <fatal-page
      v-if='type === "fatal"'
      :open="open"
      :title="title"
      :message="message"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { bus, event, PageNotifyType, PageNotifyTask } from "../lib"
import FatalPage from "./FatalPage.vue"
import Page from "./Page.vue"

@Component({
  components: {
    "fatal-page": FatalPage,
    "page": Page
  }
})
export default class PageNotify extends Vue {
  public mounted(): void {
    bus.$on(event.pageNotifyTaskCreate, (task: PageNotifyTask) => {
      this.show(task)
    })
  }

  public open = false;

  public type: PageNotifyType | "" = ""

  public title = "";

  public message = "";

  public show(task: PageNotifyTask): void {
    this.title = task.title
    this.message = task.message

    this.type = task.notifyType

    this.open = true
  }
}
</script>

<style scoped>
.card {
  font-family: "Noto Sans JP", sans-serif;
  background-color: white;
  overflow-y: hidden;
}
.card-title {
  padding: 14px 22px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
}
.card-title-text {
  color: #767676;
  font-size: 18.72px;
}
.label {
  color: rgb(99, 99, 99) !important;
  font-size: 14.5px;
}
.message {
  margin-bottom: 24px;
}
</style>
