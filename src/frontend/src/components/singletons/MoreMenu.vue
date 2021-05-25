<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-bottom="45"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="menuButton" icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list class="py-0">
        <v-list-item @click="logout" :ripple="false" class="list-item logoutButton">
          <v-list-item-content>
            <v-list-item-subtitle>
              ログアウト
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { types } from "@/providers/types"
import { VuexContext } from "@/providers/containers"
import { AuthenticationTokenContext } from "@/store/modules/authenticationToken"
import { routeNames } from "@/router/routeNames"

@Component
export default class MoreMenu extends Vue {
  @VuexContext(types.vuexContext.authenticationToken)
  private $authenticationToken!: AuthenticationTokenContext

  /**
   * メニューを表示するか否かを保持する.
   */
  public menu = false;

  /**
   * ログアウトボタンのクリックイベントを処理する.
   */
  public async logout(): Promise<void> {
    await this.$authenticationToken.actions.forget()

    this.$router.push({ name: routeNames.login })
  }
}
</script>

<style lang="scss" scoped>
.list-item:hover {
  background-color: rgba($color: #000000, $alpha: 0.03);
}
</style>
