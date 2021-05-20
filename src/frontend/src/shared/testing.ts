import flushPromises from "flush-promises"

/**
 * 例外を発生させ、処理を失敗させる.
 */
export const fail = (): void => {
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

/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * 標準出力モックを取得する.
 */
export const useStdoutMock = (): jest.SpyInstance => {
  let stdout!: jest.SpyInstance

  beforeAll(() => {
    stdout = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterAll(() => {
    stdout.mockReset()
    stdout.mockRestore()
  })

  return stdout
}

/**
 * エラー標準出力をスタブ化する.
 */
export const stubStderr = (): jest.SpyInstance => {
  return jest.spyOn(console, "error").mockImplementation(() => {})
}

/**
 * エラー標準出力モックを取得する.
 */
export const useStderrMock = (): jest.SpyInstance => {
  return jest.spyOn(console, "error").mockImplementation(() => {})
}
