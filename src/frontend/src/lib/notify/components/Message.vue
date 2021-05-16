<template>
  <div :class='["wrapper", selector]'>
    <div class="title">{{ title }}</div>
    <div class="message">{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { MessageNotifyType } from "../lib"

@Component
export default class Message extends Vue {
  @Prop({ type: String, required: true })
  public title!: string;

  @Prop({ type: String, required: true })
  public message!: string;

  @Prop({ type: String, required: true })
  public type!: MessageNotifyType

  public get selector(): string {
    switch (this.type) {
      case "info":
        return "info-notify"
      case "success":
        return "success-notify"
      case "warning":
        return "warning-notify"
      case "error":
        return "error-notify"
      default:
        return "info-notify"
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 360px;
  min-height: 12px;
  padding: 12px 24px;
  margin: 24px;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 0.9em;
  border-radius: 5px;
  box-shadow: 0px 6px 28px 0px rgba(0, 0, 0, 0.14);
}
.title {
  padding: 12px 0;
  font-size: 1.2em;
  font-weight: 700;
}
.message {
  white-space: pre-line;
  line-height: 25px;
  padding-bottom: 12px;
}
/* Component Type */
.info-notify {
  background-color: #b1dee9;
  border: 0 solid #0286a5;
}
.success-notify {
  background-color: #b1e9bd;
  border: 0 solid #02a502;
}
.warning-notify {
  background-color: #fff2c8;
  border: 0 solid #c6c600;
}
.error-notify {
  background-color: #e9b1b1;
  border: 0 solid #ca002c;
}
</style>
