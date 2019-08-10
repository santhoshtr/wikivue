<template>
  <article-content :article="article" />
</template>

<script>
import ArticleContent from "../components/ArticleContent";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Article",
  components: {
   ArticleContent
  },
  computed: {
    ...mapState({
      article: state =>
        state.article,
      contentLanguage: state => state.app.contentLanguage
    }),
    title: function() {
      return this.$route.params.title || "";
    }
  },
  watch: {
    title: function() {
      this.loadArticle();
    }
  },
  mounted: function() {
    this.loadArticle();
  },
  methods: {
    loadArticle() {
      if (this.$route.meta.random) {
        this.$store.dispatch("article/fetch", {
          language: this.contentLanguage
        });
      } else {
        this.$store.dispatch("article/fetch", {
          title: this.title,
          language: this.contentLanguage
        });
      }
    }
  }
};
</script>
