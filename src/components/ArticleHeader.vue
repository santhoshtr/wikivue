<template>
  <header
    class="artcle-header"
  >
    <v-layout
      column
      class="mt-0"
    >
      <v-flex
        xs12
        sm12
        md12
        lg12
      >
        <v-card
          flat
          class="pa-1"
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
          <v-card-actions
            class="mx-0 pa-0 hidden-sm-and-down"
          >
            <v-btn
              text
              class="  body-2 font-weight-regular"
              :to="`/page/${contentLanguage}/${title}?oldid=${revision}`"
              v-if="lastmodifier"
            >
              <v-icon small>
                history
              </v-icon>
              {{ $i18n('article-lastmodified',lastmodifier.user, lastmodified) }}
            </v-btn>
            <div class="flex-grow-1" />
            <v-btn
              small
              text
              class="font-weight-regular"
              :href="locationLink(article)"
              target="__blank"
              v-if="loaded && article.geo"
            >
              <v-icon>location_on</v-icon>
            </v-btn>
            <v-btn
              small
              text
              class="font-weight-regular"
              :href="`https://www.wikidata.org/wiki/${article.wikidataId}`"
              v-if="loaded && article.wikidataId"
              target="__blank"
            >
              <v-img
                src="../assets/Wikidata-logo.svg"
                max-width="24"
              />
            </v-btn>
            <audio
              controls
              v-if="loaded && article.pronunciation"
              :src="article.pronunciation.url"
            />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
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
      return imgURL || require('@/assets/Wikipedia logo version 2.svg?lazy');
    },
    revision: function(){
      return this.article.history.lastrevision
    },
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      title: state => state.article.title,
    }),
  },
  methods:{
    locationLink(article){
      if(article.geo){
      return `https://www.openstreetmap.org/?mlat=${article.geo.latitude}&mlon=${article.geo.longitude}&zoom=12&layers=M`
      }
    }
  }
}
</script>
<style scoped>
audio{
  max-width:48px;
}
</style>