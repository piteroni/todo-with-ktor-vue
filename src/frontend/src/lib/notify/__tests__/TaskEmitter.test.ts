import { waitUntilForDone } from "@/shared/testing"
import { mount, Wrapper } from "@vue/test-utils"
import Vue from "vue"
import { event, MessageNotifyTask, PageNotifyTask, TaskEmitter } from "../lib"

describe("TaskEmitter", () => {
  let wrapper: Wrapper<Vue>
  let emitter: TaskEmitter

  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    wrapper = mount(Vue.extend({
      template: "<div></div>" // templateがないことによるwarningを回避するため
    }))
    emitter = new TaskEmitter(wrapper.vm)
  })

  it("メッセージ通知タスクをComponentに送信できる", () => {
    const expected: Array<Array<MessageNotifyTask>> = [[{
      notifyType: "info",
      title: "メッセージ通知タイトル",
      message: "メッセージ通知メッセージ"
    }]]

    // タスクが保留されないようにmountedイベントを送出.
    wrapper.vm.$emit(event.componentMounted)

    emitter.addTask({
      notifyType: "message",
      messageNotifyType: "info",
      title: "メッセージ通知タイトル",
      message: "メッセージ通知メッセージ"
    })

    expect(wrapper.emitted("message-tasks:create")).toBeTruthy()
    expect(wrapper.emitted("message-tasks:create")).toEqual(expected)
  })

  it("ページ通知タスクをComponentに送信できる", () => {
    const expected: Array<Array<PageNotifyTask>> = [[{
      notifyType: "fatal",
      title: "ページ通知タイトル",
      message: "ページ通知メッセージ"
    }]]

    wrapper.vm.$emit(event.componentMounted)

    emitter.addTask({
      notifyType: "page",
      pageNotifyType: "fatal",
      title: "ページ通知タイトル",
      message: "ページ通知メッセージ"
    })

    expect(wrapper.emitted("page-task:create")).toBeTruthy()
    expect(wrapper.emitted("page-task:create")).toEqual(expected)
  })

  it("Componentのマウントが完了していない場合、タスクの送信を保留することができる", async () => {
    /* eslint-disable prefer-const */
    let emittedWithPending: { [name: string]: Array<Array<any>> | undefined }
    let emittedWithComplate: { [name: string]: Array<Array<any>> | undefined }

    const task: PageNotifyTask = {
      notifyType: "fatal",
      title: "ページ通知タイトル",
      message: "ページ通知メッセージ"
    }

    const expected = {
      "component:mounted": [[]],
      "page-task:create": [[task]]
    }

    emitter.addTask({
      notifyType: "page",
      pageNotifyType: "fatal",
      title: "ページ通知タイトル",
      message: "ページ通知メッセージ"
    })

    // マウント前のイベント送信情報を取得する、なお参照渡しだとマウント前のイベント送信情報を正確に取得できないため値渡しする
    emittedWithPending = { ...wrapper.emitted() }

    // emitterにコンポーネントのマウントが完了したことを通知する
    wrapper.vm.$emit(event.componentMounted)

    // setTimeoutにて作成された処理をすべて実行する
    jest.runAllTimers()

    // 保留中のタスクの送信処理が完了するまでまつ
    await waitUntilForDone()

    // マウント後のイベント送信情報を取得する
    emittedWithComplate = wrapper.emitted()

    expect(emittedWithPending).toEqual({})
    expect(emittedWithComplate).toEqual(expected)
    /* 1回のタスク送信処理につき、1回の遅延処理が実行される */
    expect(setTimeout).toBeCalledTimes(1)
  })
})
