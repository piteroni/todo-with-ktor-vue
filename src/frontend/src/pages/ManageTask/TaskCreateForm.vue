<template>
  <v-form ref="form" lazy-validation class="mb-6">
    <v-col cols="4" class="pa-0">
      <v-subheader class="pb-2 px-0 subtitle-1">
        タスク登録
      </v-subheader>

      <v-layout>
        <v-text-field
          v-model="taskName"
          class="taskInput"
          label="タスク"
          :rules="taskRules"
        ></v-text-field>

        <div class="my-auto">
          <v-btn class="taskCreateButton" icon @click="createTask">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-layout>
    </v-col>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator"
import { types } from "@/providers/types"
import { RetainedTaskContext } from "@/store/modules/retainedTask"
import { VuexContext } from "@/providers/containers"
import { VForm, VTextRule } from "@/shared/vuetify"

@Component
export default class TaskCreateForm extends Vue {
  @Ref()
  public form!: VForm;

  @VuexContext(types.vuexContext.retainedTask)
  private $retainedTask!: RetainedTaskContext

  /**
   * タスク内容を保持する.
   */
  public taskName = ""

  /**
   * フォーム内の入力値が有効であるか取得する.
   *
   * @return
   *   フォーム内の入力値が有効であるか.
   */
  private get isValid(): boolean {
    return this.form.validate()
  }

  /**
   * タスクのバリデーションルールを取得する.
   */
  public get taskRules(): Array<VTextRule> {
    return [
      (v: string | undefined) => !!v || "タスクを入力してください",
      (v: string | undefined) => (v && v.length <= 256) || "タスクは256文字以内で入力してください"
    ]
  }

  /**
   * タスク作成ボタンのクリックイベントを処理する.
   */
  public async createTask(): Promise<void> {
    if (!this.isValid) {
      return
    }

    try {
      await this.$retainedTask.actions.createTask(this.taskName)
    } catch (e) {
      console.error(e)
      this.$notify.fatal()
      return
    }

    this.reset()
  }

  /**
   * フォームの値を初期化する.
   */
  private reset(): void {
    this.form.reset()
    this.taskName = ""
  }
}
</script>
