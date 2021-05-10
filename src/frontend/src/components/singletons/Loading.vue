<template>
  <div v-show="loading">
    <div class="fullview">
      <div class="loading-spacer"></div>
      <loading
        v-show="loading"
        type="spiningDubbles"
        :size="{ width: '300px', height: '300px' }"
      ></loading>
    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { VueLoading } from "vue-loading-template"

@Component({
  components: {
    "loading": VueLoading,
  },
})
export default class Loading extends Vue {
  /**
   * ローディングフラグ.
   */
  @Prop({ default: false })
  public loading!: boolean;
}
</script>

<style scoped>
.fullview {
  width: 100%;
  height: 100%;
  background: #fefefe11;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-spacer {
  height: 30%;
}
</style>
