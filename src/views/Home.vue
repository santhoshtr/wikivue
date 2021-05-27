<template>
  <v-container fluid grid-list-xl>
    <article>
      <v-layout justify-center row>
        <v-flex xs12 sm12 md10 lg10 v-if="tfa">
          <h2>Featured article</h2>
          <v-card
            :to="`/page/${contentLanguage}/${tfa.normalizedtitle}`"
            class="overflow-hidden"
            color="transparent"
            flat
          >
            <v-row class="overflow-hidden">
              <v-col class="pa-0 ma-0" cols="12" lg="6" md="6" sm="12">
                <v-img
                  :src="
                    tfa.originalimage
                      ? tfa.originalimage.source
                      : require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                  "
                  :lazy-src="
                    require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                  "
                  height="250"
                  contain
                ></v-img>
              </v-col>
              <v-col class="pa-0 ma-0" cols="12" lg="6" md="6" sm="12">
                <v-card-title>
                  <h3 class="headline" v-html="tfa.displaytitle" />
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1" v-html="tfa.extract_html"></p>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout justify-center row>
        <v-flex xs12 sm12 md10 lg10>
          <h2>Trending</h2>
          <v-row justify="center">
            <v-col
              md="6"
              lg="4"
              sm="12"
              xs="12"
              v-for="article in [...mostreadArticles]"
              :key="article.pageid"
            >
              <v-card
                :to="`/page/${contentLanguage}/${article.normalizedtitle}`"
                min-width="300px"
                color="transparent"
                height="300px"
                flat
              >
                <v-img
                  :src="
                    article.originalimage
                      ? article.originalimage.source
                      : require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                  "
                  :contain="!article.originalimage"
                  :cover="!!article.originalimage"
                  :position="
                    article.originalimage ? 'center 33%' : 'center center'
                  "
                  width="100%"
                  :lazy-src="
                    require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                  "
                  :height="$vuetify.breakpoint.mdAndUp ? '250px' : '300px'"
                >
                  <v-row class="fill-height  align-end " style="opacity: 0.85;">
                    <v-col class="px-2 py-0 ma-0">
                      <v-card-title class="pa-1 grey darken-3 white--text ">
                        <h4 class="headline" v-html="article.displaytitle" />
                      </v-card-title>
                      <v-card-text
                        class="extract text-xs-left pa-1   grey darken-3 white--text"
                      >
                        <h4 class="text-body-1">{{ article.description }}</h4>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>
    </article>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import generalApi from "../wiki/api/general";

export default {
  name: "Home",
  data: () => ({
    mostreadArticles: [],
    tfa: null
  }),
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    })
  },
  watch: {
    contentLanguage: function() {
      this.feed();
    }
  },
  mounted: function() {
    this.feed();
  },
  methods: {
    feed() {
      generalApi.fetchFeed(this.contentLanguage).then(feed => {
        this.mostreadArticles = feed.mostread.articles;
        this.tfa = feed.tfa;
      });
    }
  }
};
</script>
