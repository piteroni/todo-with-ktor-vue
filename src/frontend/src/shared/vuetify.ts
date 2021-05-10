/**
 * v-appに相当するDOMエレメントをbody elementに追加する.
 */
export const appendVApp = (): void => {
  const app = document.createElement("div")
  app.setAttribute("data-app", "true")
  document.body.append(app)
}

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export type VTextRuleResponse = true | string;

export interface VTextRule {
  (v: string | undefined): VTextRuleResponse;
}

/**
 * 値が入力されていることを期待する.
 */
export const required = (v: string | undefined, message: string): VTextRuleResponse => !!v || message
