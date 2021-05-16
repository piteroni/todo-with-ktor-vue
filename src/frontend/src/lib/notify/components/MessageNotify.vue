<template>
  <div class="fixed">
    <transition-group name="fade-1s" tag="div">
      <message
        v-for="message in messages"
        :key="`${message.id}-notify-comp`"
        :type="message.type"
        :title="message.title"
        :message="message.message"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { bus, event, MessageNotifyTask, Message } from "../lib"
import MessageComponent from "./Message.vue"

@Component({
  components: {
    "message": MessageComponent
  }
})
export default class MessageNotify extends Vue {
  private messages: Message[] = []

  private id = 0;

  private timeout = 4 as const;

  public mounted(): void {
    bus.$on(event.messageNotifyTaskCreate, (task: MessageNotifyTask) => {
      this.show(task)
    })
  }

  /**
   * メッセージの表示処理を行う.
   *
   * @param content
   */
  public show(task: MessageNotifyTask): void {
    const newMessageId = this.addMessage(task)

    setTimeout(() => this.deleteMessage(newMessageId), this.timeout * 1000)
  }

  /**
   * メッセージを追加する.
   *
   * @param task
   * @return
   *   追加したメッセージのID
   */
  private addMessage(task: MessageNotifyTask): number {
    const newMessageId = ++this.id

    this.messages.push({
      id: newMessageId,
      type: task.notifyType,
      title: task.title,
      message: task.message
    })

    return newMessageId
  }

  /**
   * 指定したメッセージを削除する.
   *
   * @param id
   *   削除対象となるメッセージのID.
   */
  private deleteMessage (id: number): void {
    this.messages = this.messages.filter(message => message.id !== id)
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
  right: 0px;
  bottom: 0px;
  margin-right: 32px;
  margin-bottom: 32px;
}
</style>

<style>
.fade-1s-enter-active,
.fade-1s-leave-active {
  transition: all 1s;
}

.fade-1s-enter,
.fade-1s-leave-to {
  opacity: 0;
}
</style>
