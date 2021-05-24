import { TaskEmitter, NotifyClient } from "./lib"

export class NotifyApi implements NotifyClient {
  private emitter!: TaskEmitter

  constructor(emitter: TaskEmitter) {
    this.emitter = emitter
  }

  public info(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "info",
      title: title || "Info",
      message
    })
  }

  public warn(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "warning",
      title: title || "Warning",
      message
    })
  }

  public success(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "success",
      title: title || "Success",
      message
    })
  }

  public error(message: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "message",
      messageNotifyType: "error",
      title: title || "Error",
      message
    })
  }

  public fatal(message?: string, title?: string): void {
    this.emitter.addTask({
      notifyType: "page",
      pageNotifyType: "fatal",
      title: title ?? "エラー",
      message: message ?? "問題が発生しました、しばらくお待ち頂き、ページのリロードをお願いします"
    })
  }
}
