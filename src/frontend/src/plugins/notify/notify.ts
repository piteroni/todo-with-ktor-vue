import Vue from "vue"
/* eslint-disable import/extensions, import/no-unresolved */
import { VueConstructor, CombinedVueInstance } from "vue/types/vue"
import { sleep } from "@/shared/helpers"
import { Notify as INotify, Message, NotifyType } from "./types"

export const messageBus = new Vue({
  data: {
    isMounted: false,
    onMounted (): any {
      return undefined
    },
  },
  watch: {
    isMounted (): void {
      this.onMounted()
    },
  },
})

export type Bus = CombinedVueInstance<
  Vue,
  {
    isMounted: boolean;
    onMounted: () => void;
  },
  Record<never, unknown>,
  Record<never, unknown>,
  Record<never, unknown>
>;

export class Notify implements INotify {
  private bus!: Bus;

  private stack: Message[] = [];

  constructor (bus: Bus) {
    this.bus = bus
    this.bus.onMounted = () => this.flush()
  }

  /**
   * メッセージをbusに送出する.
   *
   * @param message
   */
  private async emit (message: Message) {
    if (!this.bus.isMounted) {
      this.stack.push(message)
      return
    }

    this.bus.$emit("set-content", message)
  }

  /**
   * スタック上のメッセージを送出する.
   */
  private async flush () {
    if (!this.stack.length) return

    const dalay = 500 // 0.5s

    while (this.stack.length) {
      /* eslint-disable no-await-in-loop */
      await sleep(dalay)

      this.bus.$emit("set-content", this.stack.shift())
    }
  }

  /**
   * メッセージを表示する.
   *
   * @param type
   * @param message
   * @param title
   */
  public show (type: NotifyType, title: string, message: string): void {
    this.emit({ type, title, message })
  }

  /**
   * 通知メッセージを表示する.
   *
   * @param message
   * @param title
   */
  public info (message: string, title?: string): void {
    this.emit({
      type: "info",
      title: title || "Info",
      message,
    })
  }

  /**
   * 通知メッセージを表示する.
   *
   * @param message
   * @param title
   */
  public warn (message: string, title?: string): void {
    this.emit({
      type: "warning",
      title: title || "Warning",
      message,
    })
  }

  /**
   * 成功メッセージを表示する.
   *
   * @param message
   * @param title
   */
  public success (message: string, title?: string): void {
    this.emit({
      type: "success",
      title: title || "Success",
      message,
    })
  }

  /**
   * エラーメッセージを表示する.
   *
   * @param message
   * @param title
   */
  public error (message: string, title?: string): void {
    this.emit({
      type: "error",
      title: title || "Error",
      message,
    })
  }
}

export default {
  install (v: VueConstructor<Vue>): void {
    /* eslint-disable no-param-reassign */
    v.prototype.$notify = new Notify(messageBus)
  },
}
