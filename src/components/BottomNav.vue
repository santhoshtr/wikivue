<template>
  <v-sheet>
    <v-bottom-navigation
      v-if="bottomNav"
      grow
      app
      hide-on-scroll
    >
      <article-revisions />

      <v-btn value="bookmark">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>

      <article-languages />

      <v-btn
        v-show="tocButtonShown"
        value="tocbutton"
        @click="showToc"
      >
        <v-icon>mdi-table-of-contents</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-navigation-drawer
      v-model="tocShown"
      right
      clipped
      app
      temporary
      class="toc-drawer"
    >
      <table-of-contents :toc="toc" />
    </v-navigation-drawer>
  </v-sheet>
</template>


<script>
import TableOfContents from "./TOC";
import ArticleLanguages from "./ArticleLanguages"
import ArticleRevisions from "./History"

export default {
  name: "BottomNav",
  components: {
    TableOfContents,
    ArticleRevisions,
    ArticleLanguages
  },
  data() {
    return {
      tocShown: false,
    };
  },
  computed:{
    bottomNav(){
      return !!this.$store.state.article.title &&  this.$vuetify.breakpoint.smAndDown
    },
    toc(){
      return this.$store.state.article.toc
    },
    tocButtonShown(){
      return this.$vuetify.breakpoint.smAndDown && this.toc && this.toc.length>2;
    }
  },
  methods: {
    showToc(){
      this.tocShown=true;
    },
  }
};
</script>
<style>
.toc-drawer .toc {
  max-width: 100%;
  width: 100%;
}
</style>