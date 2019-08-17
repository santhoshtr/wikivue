<template>
  <header
    class="artcle-header"
  >
    <v-layout
      column
      class="mt-0 pb-2"
    >
      <v-flex
        xs12
        sm12
        md12
        lg12
      >
        <v-card
          flat
          class="mx-auto pa-0"
        >
          <v-img
            class="banner-img ma-0 px-5"
            :height="isPreview? '100px' : '200px'"
            gradient="to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4) "
            :src="bannerImageUrl"
          >
            <v-card-title class="white--text ma-0 pa-0">
              <h1
                class=" white--text"
              >
                {{ article.title }}
              </h1>
            </v-card-title>
            <v-card-text
              class="ma-0 pa-0 white--text"
            >
              <h3
                class=" white--text font-weight-regular"
              >
                {{ description }}
              </h3>
            </v-card-text>
          </v-img>
          <v-card-text
            class="mx-0 pa-0"
          >
            <div
              v-if="loaded"
              v-i18n="{msg:'article-lastmodified', params: [lastmodifier.user, lastmodified]}"
            />
          </v-card-text>
        </v-card>
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
    },
    isPreview:{
      type: Boolean,
      default: false
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
    },
    bannerImageUrl: function(){
      const imgURL = this.article.image && this.article.image.urls && this.article.image.urls[1024];
      return imgURL || require('../assets/Wikipedia-logo.png');
    }
  }
}
</script>
