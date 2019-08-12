<template>
  <v-sheet>
    <v-bottom-navigation
      v-model="bottomNav"
      grow
      app
      hide-on-scroll
    >
      <v-btn value="recent">
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn value="bookmark">
        <v-icon>bookmark</v-icon>
      </v-btn>

      <article-languages />

      <v-btn
        v-show="sharable"
        value="sharable"
      >
        <v-icon>share</v-icon>
      </v-btn>
      <v-btn
        v-show="tocButtonShown"
        value="tocbutton"
        @click="showToc"
      >
        <v-icon>list</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-navigation-drawer
      v-model="tocShown"
      right
      hide-overlay
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
export default {
  name: "BottomNav",
  components: {
    TableOfContents,
    ArticleLanguages
  },
  data() {
    return {
      bottomNav: "recent",
      tocShown: false,
    };
  },
  computed:{
    sharable(){
      return navigator.share;
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
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: this.$store.state.article.tilte,
            text: this.$store.state.article.description,
            url: document.URL
          })
          .then(() => console.log("Successful share"))
          .catch(error => console.log("Error sharing", error));
      }
    }
  }
};
</script>
<style>
.toc-drawer .toc {
  max-width: 100%;
}
</style>