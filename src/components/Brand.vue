<template>
  <v-toolbar-title class="wikipedia" v-show="$vuetify.breakpoint.smAndUp">
    <router-link to="/">
      <span class="cap">W</span><span class="smallcap">ikipedi</span
      ><span class="cap">A</span>
    </router-link>
  </v-toolbar-title>
</template>

<script>
export default {
  name: "Brand"
};
</script>
<style lang="less">
.wikipedia {
  font-family: "Libertinus serif" !important;
  font-feature-settings: "salt";
  cursor: pointer;
  .smallcap {
    font-variant: common-ligatures small-caps;
    margin-left: -2px;
  }
}
.v-application .wikipedia a {
  color: #000;
  text-decoration: none;
}
</style>
