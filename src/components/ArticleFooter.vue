<template>
  <v-layout row class="mx-0 pa-0">
    <categories :categories="categories" />
  </v-layout>
</template>

<script>
import Categories from "./Categories";
export default {
  name: "ArticleHeader",
  props: {
    article: {
      type: Object,
      default: () => null
    }
  },
  components: {
    Categories
  },
  computed: {
    categories: function() {
      return this.article.metadata
        ? this.article.metadata.categories || []
        : [];
    }
  }
};
</script>
