import flushPromises from "flush-promises";

/**
 * マウントが完了するまで待つ.
 */
export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
}

/**
 * 処理が完了するまで待つ.
 */
export const waitUntilForDone = async (): Promise<void> => {
  await flushPromises();
}
