<template>
  <header class="artcle-header">
    <v-flex xs12 sm12 md12 lg12>
      <v-card flat v-if="$vuetify.breakpoint.smAndDown">
        <v-img
          eager
          class="banner-img ma-0"
          :height="'200px'"
          gradient="to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4) "
          :lazy-src="require('@/assets/Wikipedia-logo-version-2.svg?lazy')"
          :src="
            bannerImageUrl ||
              require('@/assets/Wikipedia-logo-version-2.svg?lazy')
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
      <v-layout fill-height v-if="$vuetify.breakpoint.mdAndUp">
        <v-flex md3 lg3>
          <v-sheet min-width="100%" min-height="100%" class="pt-5">
            <v-img
              eager
              v-if="bannerImageUrl"
              class="banner-img ma-0"
              :height="'150px'"
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
            <v-card-text class="ma-0 py-0 align-end">
              <h3
                class="text-body-2 font-weight-regular"
                v-if="lastmodifier"
                v-html="
                  $i18n(
                    'article-lastmodified',
                    lastmodifier.user,
                    lastmodifiedRelative,
                    lastmodified
                  )
                "
              ></h3>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-layout>
      <v-flex xs12 sm12 md12 lg12>
        <v-sheet>
          <v-toolbar flat dense color="transparent">
            <div class="flex-grow-1" />
            <v-toolbar-items>
              <v-dialog
                v-if="quickfacts"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                v-model="quickfactsDialog"
                attach="article"
              >
                <template v-slot:activator="{ on }">
                  <v-btn small text v-on="on">
                    <v-icon>{{ mdiLightbulbOnOutline }}</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar>
                    <v-toolbar-title>Quick facts</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn icon @click="quickfactsDialog = false">
                        <v-icon>{{ mdiClose }}</v-icon>
                      </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text v-html="quickfacts.infobox"> </v-card-text>
                </v-card>
              </v-dialog>
              <v-btn small text>
                <v-icon>{{ mdiPencilOutline }}</v-icon>
              </v-btn>
              <article-revisions :article="article" />
              <v-btn small text>
                <v-icon>{{ mdiForumOutline }}</v-icon>
              </v-btn>
              <article-languages :article="article" />
              <v-btn
                small
                text
                class="font-weight-regular"
                :href="locationLink(article)"
                target="__blank"
                v-if="loaded && article.geo"
              >
                <v-icon>{{ mdiMapMarkerOutline }}</v-icon>
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
        </v-sheet>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
import { mapState } from "vuex";
import {
  mdiClose,
  mdiLightbulbOnOutline,
  mdiPencilOutline,
  mdiForumOutline,
  mdiMapMarkerOutline
} from "@mdi/js";
import Article from "../wiki/models/article";
export default {
  name: "ArticleHeader",
  components: {
    ArticleRevisions: () => import("./History"),
    ArticleLanguages: () => import("./ArticleLanguages")
  },
  props: {
    article: {
      type: Article,
      default: () => null
    },
    quickfacts: {
      type: Object,
      default: () => null
    }
  },
  data: () => ({
    quickfactsDialog: false,
    mdiClose,
    mdiPencilOutline,
    mdiForumOutline,
    mdiMapMarkerOutline,
    mdiLightbulbOnOutline
  }),
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
      return this.article.history && this.article.history.lastmodified;
    },
    lastmodifiedRelative: function() {
      const timeDiff = Math.abs(
        new Date() - new Date(this.article.history.lastmodified).getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const rtf = new Intl.RelativeTimeFormat(this.uiLanguage);

      return rtf.format(diffDays * -1, "days");
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
      uiLanguage: state => state.app.uiLanguage
    })
  },
  methods: {
    locationLink(article) {
      if (article.geo) {
        return `https://www.openstreetmap.org/?mlat=${article.geo.latitude}&mlon=${article.geo.longitude}&zoom=12&layers=M`;
      }
    }
  }
};
</script>
<style>
audio {
  max-width: 48px;
}
</style>
