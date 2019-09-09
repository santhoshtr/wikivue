<template>
  <v-layout
    justify-center
    align-center
  >
    <v-card class="my-5">
      <v-card-title>
        <h1 align="center">
          <v-img
            :aspect-ratio="1/1"
            contain
            height="3em"
            width="3em"
            src="@/assets/Wikipedia logo version 2.svg?lazy"
          /> <span class="cap">W</span><span class="smallcap">ikipedi</span><span class="cap">A</span>
        </h1>
      </v-card-title>
      <v-card-actions
        class="my-5"
      >
        <v-btn
          text
          to="page/random"
        >
          Read Random Article
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>
<script>
export default {
  name: 'Home'
}
</script>
<style scoped lang="less" >
h1 {
  font-size: 3em;
  font-family: "Libertinus serif" !important;
  font-feature-settings: "salt";
  .smallcap {
    font-variant: common-ligatures small-caps;
  }
}
</style>