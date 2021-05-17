import flushPromises from "flush-promises"

/**
 * 例外を発生させ、処理を失敗させる.
 */
export const fail = () => {
  throw new Error()
}

/**
 * マウントが完了するまで待つ.
 */
export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises()
}

/**
 * 処理が完了するまで待つ.
 */
export const waitUntilForDone = async (): Promise<void> => {
  await flushPromises()
}
