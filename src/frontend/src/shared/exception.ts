/**
 * アプリケーション実行時におけるエラー基底クラス.
 */
export abstract class RuntimeError extends Error {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }

  /**
   * クラス名を取得する.
   *
   * @return クラス名.
   */
  public getClassName (): string {
    return this.constructor.name
  }
}
