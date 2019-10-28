<template>
  <header class="artcle-header">
    <v-flex xs12 sm12 md12 lg12>
      <v-card flat class="pa-1" v-if="$vuetify.breakpoint.smAndDown">
        <v-img
          eager
          class="banner-img ma-0"
          :height="isPreview ? '100px' : '200px'"
          gradient="to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4) "
          :lazy-src="require('@/assets/Wikipedia logo version 2.svg?lazy')"
          :src="
            bannerImageUrl ||
              require('@/assets/Wikipedia logo version 2.svg?lazy')
          "
        >
          <v-card-title class="white--text ma-0">
            <h1 class="white--text">
              {{ article.title }}
            </h1>
          </v-card-title>
          <v-card-text class="ma-0 white--text">
            <h3 class=" white--text font-weight-regular">
              {{ description }}
            </h3>
          </v-card-text>
        </v-img>
        <v-card-actions class="mx-0 pa-0 hidden-sm-and-down" />
      </v-card>
      <v-layout row fill-height v-if="$vuetify.breakpoint.mdAndUp">
        <v-flex md3 lg3>
          <v-sheet min-width="100%" min-height="100%">
            <v-img
              eager
              v-if="bannerImageUrl"
              class="banner-img mp-5"
              :height="isPreview ? '100px' : '150px'"
              width="100%"
              :src="bannerImageUrl"
              contain
              position="right center"
            />
          </v-sheet>
        </v-flex>
        <v-flex md9 lg9>
          <v-card flat height="100%" class="px-3 ma-0">
            <v-card-title class="ma-0">
              <h1>
                {{ article.title }}
              </h1>
            </v-card-title>
            <v-card-text class="ma-0">
              <h3 class="font-weight-regular">
                {{ description }}
              </h3>
            </v-card-text>
            <v-card-text class="ma-0 py-0 align-end" v-if="!isPreview">
              <h3 class="body-2 font-weight-thin" v-if="lastmodifier">
                {{
                  $i18n("article-lastmodified", lastmodifier.user, lastmodified)
                }}
              </h3>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-layout row v-if="!isPreview">
      <v-flex xs12 sm12 md12 lg12>
        <v-toolbar flat dense>
          <div class="flex-grow-1" />
          <v-toolbar-items>
            <v-btn small text>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <article-revisions />
            <v-btn small text>
              <v-icon>mdi-forum</v-icon>
            </v-btn>
            <article-languages />
            <v-btn
              small
              text
              class="font-weight-regular"
              :href="locationLink(article)"
              target="__blank"
              v-if="loaded && article.geo"
            >
              <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn
              small
              text
              class="font-weight-regular"
              :href="`https://www.wikidata.org/wiki/${article.wikidataId}`"
              v-if="loaded && article.wikidataId"
              target="__blank"
            >
              <v-img src="../assets/Wikidata-logo.svg" max-width="24" />
            </v-btn>
            <!-- <audio
              controls
              v-if="loaded && article.pronunciation"
              :src="article.pronunciation.url"
            /> -->
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ArticleHeader",
  components: {
    ArticleRevisions: () => import("./History"),
    ArticleLanguages: () => import("./ArticleLanguages")
  },
  props: {
    article: {
      type: Object,
      default: () => null
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
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
      return (
        this.article.history &&
        new Date(this.article.history.lastmodified).toLocaleString()
      );
    },
    bannerImageUrl: function() {
      const imgURL =
        this.article.image &&
        this.article.image.urls &&
        this.article.image.urls[1024];
      return imgURL;
    },
    revision: function() {
      return this.article.history.lastrevision;
    },
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      title: state => state.article.title
    })
  },
  methods: {
    locationLink(article) {
      if (article.geo) {
        return `https://www.openstreetmap.org/?mlat=${
          article.geo.latitude
        }&mlon=${article.geo.longitude}&zoom=12&layers=M`;
      }
    }
  }
};
</script>
<style scoped>
audio {
  max-width: 48px;
}
</style>
