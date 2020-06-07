<template>
  <v-sheet>
    <v-bottom-navigation v-if="bottomNav" grow app hide-on-scroll>
      <article-revisions :article="article" />

      <v-btn value="bookmark">
        <v-icon>{{ mdiBookmark }}</v-icon>
      </v-btn>

      <article-languages :article="article" />

      <v-btn v-show="tocButtonShown" value="tocbutton" @click="showToc">
        <v-icon>{{ mdiTableOfContents }}</v-icon>
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
import ArticleLanguages from "./ArticleLanguages";
import ArticleRevisions from "./History";
import { mdiBookmark, mdiTableOfContents } from "@mdi/js";
import Article from "../wiki/models/article";

export default {
  name: "BottomNav",
  components: {
    TableOfContents,
    ArticleRevisions,
    ArticleLanguages
  },
  data: () => ({
    tocShown: false,
    mdiBookmark,
    mdiTableOfContents
  }),
  props: {
    article: Article
  },
  computed: {
    bottomNav() {
      return !!this.article.title && this.$vuetify.breakpoint.smAndDown;
    },
    toc() {
      return this.article.toc;
    },
    tocButtonShown() {
      return (
        this.$vuetify.breakpoint.smAndDown && this.toc && this.toc.length > 2
      );
    }
  },
  methods: {
    showToc() {
      this.tocShown = true;
    }
  }
};
</script>
<style>
.toc-drawer .toc {
  max-width: 100%;
  width: 100%;
}
</style>
