<template>
  <div>
    <v-subheader class="pb-2 px-0 subtitle-1">
      タスク一覧
    </v-subheader>

    <ul class="taskList">
      <li class="task" v-for="(task, index) in tasks" :key="index">
        <v-layout>
          <v-col cols="4" class="pa-0">
            <div class="taskName">{{ task.name }}</div>
          </v-col>

          <div class="my-auto">
            <v-btn class="taskDeleteButton" icon @click="() => deleteTask(task.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-layout>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { VuexContext } from "@/providers/containers"
import { types } from "@/providers/types"
import { RetainedTaskListContext, RetainedTask } from "@/store/modules/retainedTaskList"

@Component
export default class RetainedTaskList extends Vue {
  @VuexContext(types.vuexContext.retainedTaskList)
  private $retainedTaskList!: RetainedTaskListContext

  /**
   * 保有タスクリストを取得する.
   */
  public get tasks(): RetainedTask[] {
    return this.$retainedTaskList.state.tasks
  }

  /**
   * タスク削除ボタンのクリックイベントを処理する.
   *
   * @param taskId
   *   削除対象のタスクのID.
   */
  public async deleteTask(taskId: number): Promise<void> {
    try {
      await this.$retainedTaskList.actions.deleteTask(taskId)
    } catch (e) {
      console.error(e)
      this.$notify.fatal()
    }
  }
}
</script>
