<template>
  <article
    :lang="language"
    :dir="contentLanguageDir"
    ref="article"
    :style="$vuetify.breakpoint.smAndDown && 'overflow:hidden;'"
    tabindex="0"
  >
    <v-progress-linear
      :active="!loaded"
      :indeterminate="!loaded"
      color="blue"
      absolute
      top
    />
    <article-content :article="article" />
    <BottomNav :article="article" />
  </article>
</template>

<script>
import ArticleContent from "../components/ArticleContent";
import { mapState, mapGetters } from "vuex";
import Article from "../wiki/models/article";

export default {
  name: "Article",
  components: {
    ArticleContent,
    BottomNav: () => import("../components/BottomNav")
  },
  data: () => ({
    title: null,
    language: null
  }),
  computed: {
    loaded() {
      return this.article.revision;
    },
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    }),
    ...mapGetters("app", ["contentLanguageDir"]),
    article() {
      return (
        this.$store.getters["wikipedia/getArticle"](
          this.language,
          this.title
        ) || new Article({ title: this.title })
      );
    }
  },
  methods: {
    loadArticle(language, title) {
      this.title = title;
      this.language = language;
      this.$store.dispatch("wikipedia/fetchArticle", {
        title,
        language
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    const title = to.params.title;
    const language = to.meta.language;
    next(vm => {
      vm.loadArticle(language, title);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    const title = to.params.title;
    const language = to.meta.language;
    this.loadArticle(language, title);
    window.document.title = title;
    next();
  },
  beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    next();
  }
};
</script>
