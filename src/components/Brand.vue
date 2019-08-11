<template>
  <v-toolbar-title
    class="wikipedia"
    v-show="$vuetify.breakpoint.smAndUp"
  >
    <span class="cap">W</span><span class="smallcap">ikipedi</span><span class="cap">A</span>
  </v-toolbar-title>
</template>

<script>
export default {
  name: 'Brand'
}
</script>
<style lang="less" >
.wikipedia {
  padding-right: 20px;
  font-family: "Libertinus serif" !important;
  font-feature-settings: "salt";
  .smallcap {
    font-variant: common-ligatures small-caps;
  }
}
</style>