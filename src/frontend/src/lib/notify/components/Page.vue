<template>
  <v-dialog v-model="open" :z-index="20" persistent width="640px">
    <v-card class="card">
      <v-card-title class="card-title">
        <div class="card-title-text">
          {{ title }}
        </div>

        <v-spacer></v-spacer>
      </v-card-title>

      <v-container class="py-4">
        <v-row class="my-2 mx-8" justify="center" align-content="center">
          <div class="message">
            <label class="label">
              {{ message }}
            </label>
          </div>
        </v-row>

        <slot name="actions"></slot>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component
export default class Page extends Vue {
  @Prop({ type: Boolean, required: true })
  public open!: boolean;

  @Prop({ type: String, required: true })
  public title!: string;

  @Prop({ type: String, required: true })
  public message!: string;
}
</script>

<style scoped>
.card {
  font-family: "Noto Sans JP", sans-serif;
  background-color: white;
  overflow-y: hidden;
}
.card-title {
  padding: 14px 22px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
}
.card-title-text {
  color: #767676;
  font-size: 18.72px;
}
.label {
  color: rgb(99, 99, 99) !important;
  font-size: 14.5px;
}
.message {
  margin-bottom: 24px;
}
</style>
