<template>
  <header class="header-wrap grey lighten-5">
    <nav class="in-wrap">
      <ul class="main-nav">
        <slot></slot>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class Navbar extends Vue {
}
</script>

<style lang="scss" scoped>
.header-wrap {
  padding: 0;
  width: 100%;
  z-index: 2;
  margin-bottom: 20px;

  .in-wrap {
    margin: 0 auto;
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    .header-title {
      font-size: 1.3em;
      font-family: 'Quicksand', sans-serif;
    }
    .main-nav {
      width: 100%;
      display: flex;
      list-style-type: none;
    }
  }
}
</style>
