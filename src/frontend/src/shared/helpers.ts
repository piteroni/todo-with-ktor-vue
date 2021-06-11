/**
 * 指定された時間、処理を停止する.
 *
 * @param ms 停止時間（ミリ秒）.
 */
export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 指定されたオブジェクトがクラスで宣言されたか否かを取得する.
 *
 * @param value 検査対象オブジェクト
 * @returns 指定されたオブジェクトがクラスで宣言されていればtrueを返す.
 */
export function isClass(value: any): boolean {
  return value && typeof value === "function" && typeof value.constructor === "function"
}
