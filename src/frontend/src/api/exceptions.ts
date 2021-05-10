import { RuntimeError } from "@/shared/exception"

/**
 * APIでエラーが発生した場合のエラーレスポンス.
 */
export type ApiErrorResponse = {
  code: string;
  message: string;
}

/**
 * API通信時に発生した場合のエラー.
 */
export class ApiError extends RuntimeError {
  public name = "APIError";

  public code = "";

  public statusCode = 0;

  constructor (message: string, statusCode?: number, code?: string) {
    super(message)
    this.code = typeof code !== "undefined" ? code : ""
    this.statusCode = typeof statusCode !== "undefined" ? statusCode : 0
  }
}

/**
 * 未認証の場合のエラー.
 */
export class UnauthorizedError extends ApiError {
  public name = "UnauthorizedError";
}

/**
 * クライエントエラーの場合のエラー.
 */
export class ClientError extends ApiError {
  public name = "ClientError";
}

/**
 * サーバーエラーの場合のエラー.
 */
export class ServerError extends ApiError {
  public name = "ServerError";
}
