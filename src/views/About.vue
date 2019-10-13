<template>
  <v-layout justify-center align-center row fill-height>
    <v-card class="my-5" :elevation="0">
      <v-card-title>
        <h1 align="center">
          <span class="cap">W</span><span class="smallcap">ikipedi</span
          ><span class="cap">A</span>
        </h1>
      </v-card-title>
    </v-card>
    <v-row class="ma-5">
      <p>
        This is a Vuejs powered modern, single page, progressive, offline
        capable web application for Wikipedia. Code named as Wikivue(pronounced
        /ˌwɪkɪ vjuː/, like wiki-view).
      </p>
      <p>
        Source code:
        <a href="https://gitlab.com/santhoshtr/wikivue"
          >https://gitlab.com/santhoshtr/wikivue</a
        >
        Author: <a href="https://thottingal.in">Santhosh Thottingal</a>
      </p>
      <p>
        This is NOT an official Wikimedia Foundation project. Wikipedia,
        Wikimedia are all trademark of
        <a
          href="https://www.wikimediafoundation.org/"
          rel="nofollow noreferrer noopener"
          target="_blank"
          >Wikimedia Foundation</a
        >. Wikipedia content is licensed under the
        <a
          href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License"
          rel="nofollow noreferrer noopener"
          target="_blank"
          >Creative Commons Attribution-ShareAlike License</a
        >.
      </p>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  name: "Home"
};
</script>
<style scoped lang="less">
h1 {
  font-size: 2.5em;
  font-family: "Libertinus serif" !important;
  font-feature-settings: "salt";
  .smallcap {
    font-variant: common-ligatures small-caps;
    margin-left: -5px;
  }
}
</style>
