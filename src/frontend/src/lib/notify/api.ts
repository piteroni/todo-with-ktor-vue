import { TaskEmitter, NotifyClient } from "./lib"

export class NotifyApi implements NotifyClient {
  private emitter!: TaskEmitter

  constructor(emitter: TaskEmitter) {
    this.emitter = emitter
  }

  /**
   * 通知メッセージを表示する.
   */
  public info(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "info",
      title: title || "Info",
      message
    })
  }

  /**
   * 警告メッセージを表示する.
   */
  public warn(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "warning",
      title: title || "Warning",
      message
    })
  }

  /**
   * 成功メッセージを表示する.
   */
  public success(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "success",
      title: title || "Success",
      message
    })
  }

  /**
   * エラーメッセージを表示する.
   *
   * @param message
   * @param title
   */
  public error(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "error",
      title: title || "Error",
      message
    })
  }

  /**
   * 致命的エラーを表示する.
   *
   * @param message
   * @param title
   */
  public fatal(message?: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "page",
      pageNotifyType: "fatal",
      title: title ?? "エラー",
      message: message ?? "問題が発生しました、しばらくお待ち頂き、ページのリロードをお願いします"
    })
  }

  /**
   * 重要メッセージを表示する.
   */
  public important(message: string, title: string): void {
    this.emitter.addTask({
      notifyType: "page",
      pageNotifyType: "important",
      title,
      message
    })
  }
}
