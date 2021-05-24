<template>
  <v-row justify="center" align-content="center">
    <v-col class="col-md-8">
      <v-card elevation="0" class="card">
        <div class="card-title">
          ログインフォーム
        </div>

        <v-form ref="form" class="pa-2 pt-6" lazy-validation>
          <v-row>
            <label for="email" class="col-md-4 text-md-right label">
              メールアドレス
            </label>

            <div class="col-md-6 pb-0">
              <v-text-field
                class="email"
                type="email"
                name="email"
                v-model="email"
                :rules="emailRules"
                outlined
                dense
              />
            </div>
          </v-row>

          <v-row>
            <label for="password" class="col-md-4 text-md-right label">
              パスワード
            </label>

            <div class="col-md-6 pb-0">
              <v-text-field
                v-model="password"
                class="password"
                type="password"
                name="password"
                :rules="passwordRules"
                outlined
                dense
              />
            </div>
          </v-row>

          <v-row v-if="isError">
            <span
              class="col-md-6 offset-md-4 py-0 invalid-feedback failureMessage"
            >
              <strong>{{ errorMessage }}</strong>
            </span>
          </v-row>

          <v-row v-if="isRedirect">
            <span
              class="col-md-6 offset-md-4 py-0 invalid-feedback redirectMessage"
            >
              <strong>ログイン時間が一定期間を過ぎました、再度ログインをお願いします</strong>
            </span>
          </v-row>

          <v-row class="mb-0">
            <div class="col-md-8 offset-md-4">

              <v-btn
                id="submitButton"
                class="loginButton"
                @click="login"
                :loading="isLoggedIn"
                depressed
                color="primary"
              >
                ログイン
              </v-btn>
            </div>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator"
import { types } from "@/providers/types"
import { VuexContext } from "@/providers/containers"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import { routeNames } from "@/router/routeNames"
import { UnauthorizedError } from "@/api/exceptions"
import { VForm, VTextRule } from "@/shared/vuetify"

@Component
export default class LoginForm extends Vue {
  @Ref()
  public form!: VForm;

  @VuexContext(types.vuexContext.authenticationToken)
  private $authenticationToken!: AuthenticationTokenContext;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

  /**
   * 入力されたメールアドレスを保持する.
   */
  public email = "";

  /**
   * 入力されたパスワードを保持する.
   */
  public password = "";

  /**
   * 認証エラーが発生したか否かを表す.
   */
  public isError = false;

  /**
   * エラーメッセージを表す.
   */
  public errorMessage = "";

  /**
   * ログイン処理を実施しているか否かを表す.
   */
  public isLoggedIn = false;

  /**
   * フォーム内の入力値が有効か取得する.
   *
   * @return
   *   フォーム内の入力値が有効か.
   */
  public get isValid(): boolean {
    return this.form.validate()
  }

  /**
   * リダイレクトされたか否かを取得する.
   */
  public get isRedirect(): boolean {
    return !!this.$route.query.isRedirect ?? false
  }

  /**
   * メールアドレス欄のバリデーションルールを取得する.
   */
  public get emailRules(): Array<VTextRule> {
    return [
      (v: string | undefined) => (v && v.length >= 3) || "メールアドレスは3文字以上入力してください",
      (v: string | undefined) => (v && v.length <= 256) || "メールアドレスは256文字以内で入力してください",
    ]
  }

  /**
   * パスワード欄のバリデーションルールを取得する.
   */
  public get passwordRules(): Array<VTextRule> {
    return [
      (v: string | undefined) => (v && v.length >= 8) || "パスワードは8文字以上入力してください",
      (v: string | undefined) => (v && v.length <= 128) || "パスワードは128文字以内で入力してください",
    ]
  }

  /**
   * ログインボタンのクリックイベントを処理する.
   */
  public async login(): Promise<void> {
    this.clearQuerys()

    if (!this.isValid) {
      return
    }

    this.clear()

    this.isLoggedIn = true

    try {
      await this.$authenticationToken.actions.fetch({
        email: this.email,
        password: this.password
      })
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        this.isLoggedIn = false
        this.feedbackError("ログインに失敗しました、入力内容をご確認下さい")
      } else {
        console.error(e)
        this.$notify.fatal()
      }

      return
    }

    this.isLoggedIn = false

    this.$router.push({ name: routeNames.manageTask })
  }

  /**
   * エラーメッセージを通知する.
   *
   * @param message
   *   エラーメッセージ.
   */
  private feedbackError(message: string): void {
    this.errorMessage = message
    this.isError = true
  }

  /**
   * エラー関連のリソースを初期化する.
   */
  private clear(): void {
    this.errorMessage = ""
    this.isError = false
  }

  /**
   * クエリを初期化する.
   */
  private clearQuerys(): void {
    /* eslint-disable arrow-body-style */
    /* eslint-disable @typescript-eslint/no-empty-function */
    this.$router.replace({ query: {} }, () => { })
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba(0, 0, 0, 0.125) !important;
}
.card-title {
  font-size: 14.5px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #e3342f;
}
.label {
  font-size: 14.5px;
  font-weight: 400;
  margin-top: 10px;
}
</style>
