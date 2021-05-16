import Vue from "vue"
import { sleep } from "@/shared/helpers"

export type NotifyType = "message" | "page";

export type MessageNotifyType = "info" | "success" | "warning" | "error";

export type PageNotifyType = "fatal" | "important";

export type NotifyTaskType = MessageNotifyType | PageNotifyType;

export interface NotifyTask {
  notifyType: NotifyType;
  messageNotifyType?: MessageNotifyType;
  pageNotifyType?: PageNotifyType;
  title: string;
  message: string;
}

export interface MessageNotifyTask {
  notifyType: MessageNotifyType;
  title: string;
  message: string;
}

export interface PageNotifyTask {
  notifyType: PageNotifyType;
  title: string;
  message: string;
}

export interface Message {
  id: number
  type: MessageNotifyType
  title: string
  message: string
}

export interface NotifyClient {
  info: (message: string, title?: string) => void;
  warn: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  fatal: (message?: string, title?: string) => void;
}

export const bus = new Vue()

export const event = {
  componentMounted: "component:mounted",
  messageNotifyTaskCreate: "message-tasks:create",
  pageNotifyTaskCreate: "page-task:create"
} as const

export class TaskEmitter {
  private bus: Vue

  private isComponentMounted = false

  private pendingTasks: NotifyTask[] = []

  constructor(bus: Vue) {
    this.bus = bus
    this.bus.$on(event.componentMounted, () => {
      this.isComponentMounted = true
      this.flushTasks()
    })
  }

  /**
   * 受け取ったタスクをbusを介して、コンポーネントに渡す
   * なおコンポーネントがマウントしていない場合、一時変数にタスクを格納し、busにタスクを渡さない.
   *
   * @param task
   */
  public addTask(task: NotifyTask): void {
    if (!this.isComponentMounted) {
      this.pendingTasks.push(task)

      return
    }

    this.emit(task)
  }

  /**
   * 保留中のタスクを一定時間を毎にbusを介して、コンポーネントに渡す.
   */
  private async flushTasks(): Promise<void> {
    if (!this.pendingTasks.length) {
      return
    }

    const dalayTime = 500 // 0.5s

    while (this.pendingTasks.length) {
      /* eslint-disable no-await-in-loop */
      await sleep(dalayTime)

      this.emit(this.pendingTasks.shift() as NotifyTask)
    }
  }

  /**
   * 保留中のタスクを一定時間を毎にbusを介して、コンポーネントに渡す.
   */
  private emit(task: NotifyTask): void {
    switch (task.notifyType) {
      case "message": {
        const newTask: MessageNotifyTask = {
          notifyType: task.messageNotifyType as MessageNotifyType,
          title: task.title,
          message: task.message
        }

        this.bus.$emit(event.messageNotifyTaskCreate, newTask)
        break
      }
      case "page": {
        const newTask: PageNotifyTask = {
          notifyType: task.pageNotifyType as PageNotifyType,
          title: task.title,
          message: task.message,
        }

        this.bus.$emit(event.pageNotifyTaskCreate, newTask)
      }
    }
  }
}
