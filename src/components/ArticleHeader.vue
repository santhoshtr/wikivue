<template>
  <header
    class="artcle-header"
  >
    <v-layout
      row
      class="mx-0 pa-0 py-2"
    >
      <v-flex
        xs12
        sm12
        md8
        lg8
      >
        <v-card-text
          class="mx-0 pa-0"
        >
          <h1
            class="text--primary"
            fixed
          >
            {{ article.title }}
          </h1>
          <h3 class="font-weight-regular">
            {{ description }}
          </h3>
          <v-divider />
          <div
            v-if="loaded"
            v-i18n="{msg:'article-lastmodified', params: [lastmodifier.user, lastmodified]}"
          />
        </v-card-text>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
export default {
  name: 'ArticleHeader',
  props: {
    article: {
      type: Object,
      default: () => null
    }
  },
  computed:{
     loaded: function() {
      return (
        this.article.loadingStatus === "success" ||
        this.article.loadingStatus === "failure"
      );
    },
    description: function() {
      return this.article.description;
    },
    lastmodifier: function() {
      return this.article.history && this.article.history.lastmodifier;
    },
    lastmodified: function() {
      return this.article.history && new Date(this.article.history.lastmodified).toLocaleString();
    }
  }
}
</script>
