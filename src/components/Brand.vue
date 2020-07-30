<template>
  <v-toolbar-title class="wikipedia" v-show="$vuetify.breakpoint.smAndUp">
    <v-btn x-large text to="/">
      <span class="cap">W</span><span class="smallcap">ikipedi</span
      ><span class="cap">A</span>
    </v-btn>
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
</style>
