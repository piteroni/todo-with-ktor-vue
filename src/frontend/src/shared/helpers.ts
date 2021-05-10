/**
 * 指定された時間、処理を停止する.
 *
 * @param ms 停止時間（ミリ秒）.
 */
export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
