<template>
  <div class="fixed">
    <transition-group name="fade-1s" tag="div">
      <message-box
        v-for="content in contents"
        :key="`${content.id}-notify-comp`"
        :type="content.type"
        :title="content.title"
        :message="content.message"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/max-attributes-per-line */
import { Component, Vue } from "vue-property-decorator"
import { Message, MessageInstance } from "./types"
import { messageBus } from "./notify"
import MessageBox from "./MessageBox.vue"

@Component({
  components: {
    "message-box": MessageBox,
  },
})
export default class Container extends Vue {
  private contents: MessageInstance[] = [];

  private id = 0;

  private readonly timeout = 4;

  public created () {
    messageBus.$on("set-content", (content: Message) => {
      this.show(content)
    })
  }

  public mounted () {
    messageBus.isMounted = true
  }

  /**
   * メッセージコンテンツを新規に追加する.
   *
   * @param content
   *   追加するメッセージコンテンツ.
   * @returns
   *   コンテンツのID.
   */
  private addItem (content: Message): number {
    this.id++
    this.contents = [...this.contents, { ...content, id: this.id }]
    return this.id
  }

  /**
   * メッセージコンテンツを削除する.
   *
   * @param id
   *   削除対象となるコンテンツのID.
   */
  private deleteItem (id: number) {
    this.contents = this.contents.filter((content) => content.id !== id)
  }

  /**
   * メッセージの表示処理を行う.
   *
   * @param content
   */
  public show (content: Message): void {
    const id = this.addItem(content)
    setTimeout(() => this.deleteItem(id), this.timeout * 1000)
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
