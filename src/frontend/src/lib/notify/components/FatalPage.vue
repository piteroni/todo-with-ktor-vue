<template>
  <page :open="open" :title="title" :message="message">
    <template v-slot:actions>
      <v-card-actions>
        <v-layout justify-center>
          <span>
            <v-btn :ripple="false" @click="reload">
              ページをリロードする
            </v-btn>
          </span>
        </v-layout>
      </v-card-actions>
    </template>
  </page>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator"
import Page from "./Page.vue"

@Component({
  components: {
    "page": Page
  }
})
export default class FatalPage extends Vue {
  @Prop({ type: Boolean, required: true })
  public open!: boolean;

  @Prop({ type: String, required: true })
  public title!: string;

  @Prop({ type: String, required: true })
  public message!: string;

  public reload(): void {
    this.$window.location.reload()
  }
}
</script>
