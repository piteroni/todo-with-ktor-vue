import Vue from "vue"
import { NotifyApi } from "../api"
import { NotifyTask } from "../lib"
import { addTask, TaskEmitterMock } from "./fixtures/TaskEmitterMock"

describe("NotifyApi", () => {
  const emitter = new TaskEmitterMock(new Vue())
  const notifier = new NotifyApi(emitter)

  afterEach(() => {
    addTask.mockClear()
  })

  describe("情報メッセージ通知", () => {
    it("情報メッセージ通知タスクを作成することができる", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "info",
        title: "通知タイトル",
        message: "通知メッセージ"
      }

      notifier.info("通知メッセージ", "通知タイトル")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("タイトルを指定しない場合、デフォルトのタイトルが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "info",
        title: "Info",
        message: "通知メッセージ"
      }

      notifier.info("通知メッセージ")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })
  })

  describe("警告メッセージ通知", () => {
    it("警告メッセージ通知タスクを作成することができる", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "warning",
        title: "警告タイトル",
        message: "警告メッセージ"
      }

      notifier.warn("警告メッセージ", "警告タイトル")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("タイトルを指定しない場合、デフォルト警告タイトルが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "warning",
        title: "Warning",
        message: "警告メッセージ"
      }

      notifier.warn("警告メッセージ")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })
  })

  describe("成功メッセージ通知", () => {
    it("成功メッセージ通知タスクを作成することができる", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "success",
        title: "成功タイトル",
        message: "成功メッセージ"
      }

      notifier.success("成功メッセージ", "成功タイトル")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("タイトルを指定しない場合、デフォルト成功タイトルが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "success",
        title: "Success",
        message: "成功メッセージ"
      }

      notifier.success("成功メッセージ")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })
  })

  describe("エラーメッセージ通知", () => {
    it("エラーメッセージ通知タスクを作成することができる", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "error",
        title: "エラータイトル",
        message: "エラーメッセージ"
      }

      notifier.error("エラーメッセージ", "エラータイトル")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("タイトルを指定しない場合、デフォルトエラータイトルが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "message",
        messageNotifyType: "error",
        title: "Error",
        message: "エラーメッセージ"
      }

      notifier.error("エラーメッセージ")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })
  })

  describe("致命的エラー通知", () => {
    it("致命的エラー通知タスクを作成することができる", () => {
      const expected: NotifyTask = {
        notifyType: "page",
        pageNotifyType: "fatal",
        title: "致命的エラータイトル",
        message: "致命的エラーメッセージ"
      }

      notifier.fatal("致命的エラーメッセージ", "致命的エラータイトル")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("タイトルを指定しない場合、デフォルトエラータイトルが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "page",
        pageNotifyType: "fatal",
        title: "エラー",
        message: "致命的エラーメッセージ"
      }

      notifier.fatal("致命的エラーメッセージ")

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })

    it("メッセージを指定しない場合、デフォルトエラーメッセージが適応される", () => {
      const expected: NotifyTask = {
        notifyType: "page",
        pageNotifyType: "fatal",
        title: "エラー",
        message: "問題が発生しました、しばらくお待ち頂き、ページのリロードをお願いします"
      }

      notifier.fatal()

      expect(addTask).toBeCalledTimes(1)
      expect(addTask).toBeCalledWith(expected)
    })
  })
})
