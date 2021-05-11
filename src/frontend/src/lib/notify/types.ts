export type NotifyType = "info" | "success" | "warning" | "error";

export type PositionType =
  | "top-left"
  | "top-right"
  | "buttom-left"
  | "buttom-right";

/**
 * 通知メッセージの内容.
 */
export type MessageContent = {
  title?: string;
  message: string;
};

/**
 * 通知メッセージ.
 */
export type Message = {
  type: NotifyType;
  title: string;
  message: string;
};

/**
 * インスタンス化された通知メッセージ.
 */
export type MessageInstance = {
  id: number;
  type: NotifyType;
  title?: string;
  message: string;
};

export interface Notify {
  // show: (type: NotifyType, title: string, message: string) => void;
  info: (message: string, title?: string) => void;
  warn: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}
