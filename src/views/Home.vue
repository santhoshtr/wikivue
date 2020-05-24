<template>
  <v-container fluid grid-list-xl>
    <article>
      <v-layout justify-center row>
        <v-flex xs12 sm12 md10 lg10 v-if="tfa">
          <h2><v-icon>mdi-star-circle</v-icon>Featured article</h2>
          <v-card
            :to="`/page/${contentLanguage}/${tfa.normalizedtitle}`"
            class="overflow-hidden"
            outlined
          >
            <v-row class="overflow-hidden">
              <v-col class="pa-0 ma-0" cols="12" lg="6" md="6" sm="12">
                <v-img
                  :src="
                    tfa.thumbnail
                      ? tfa.thumbnail.source
                      : require('@/assets/Wikipedia logo version 2.svg?lazy')
                  "
                  :lazy-src="
                    require('@/assets/Wikipedia logo version 2.svg?lazy')
                  "
                  height="300"
                  contain
                >
                </v-img>
              </v-col>
              <v-col class="pa-0 ma-0" cols="12" lg="6" md="6" sm="12">
                <v-card-title>
                  <h3 class="headline" v-html="tfa.displaytitle" />
                </v-card-title>
                <v-card-text>
                  <p class="body-1" v-html="tfa.extract_html"></p>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout justify-center row>
        <v-flex xs12 sm12 md10 lg10>
          <h2><v-icon>mdi-trending-up</v-icon>Trending</h2>
          <v-divider />
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
                class="ma-2 overflow-y-hidden"
                outlined
              >
                <v-img
                  :src="
                    article.thumbnail
                      ? article.thumbnail.source
                      : require('@/assets/Wikipedia logo version 2.svg?lazy')
                  "
                  cover
                  :lazy-src="
                    require('@/assets/Wikipedia logo version 2.svg?lazy')
                  "
                  :height="$vuetify.breakpoint.mdAndUp ? '300px' : 'auto'"
                  aspect-ratio="1"
                >
                  <v-row class="fill-height align-end " style="opacity: 0.85;">
                    <v-col class="px-2 py-0 ma-0">
                      <v-card-title
                        class="pa-0 px-2 grey darken-3 white--text overflow-hidden text-no-wrap"
                      >
                        <h4 class="title" v-html="article.displaytitle" />
                      </v-card-title>
                      <v-card-text
                        class="extract px-2 text-xs-left overflow-hidden text-no-wrap grey darken-3 white--text"
                      >
                        <h4 class="body-1">{{ article.description }}</h4>
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
import axios from "axios";
import { mapState } from "vuex";

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
      const today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const date = ("0" + today.getDate()).slice(-2);
      const api = `https://${
        this.contentLanguage
      }.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
      axios.get(api).then(response => {
        this.mostreadArticles = response.data.mostread.articles;
        this.tfa = response.data.tfa;
      });
    }
  }
};
</script>
