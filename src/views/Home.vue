<template>
  <v-container fluid grid-list-xl>
    <v-layout justify-center row>
      <v-flex xs12 sm12 md9 lg9>
        <h2><v-icon>mdi-star-circle</v-icon>Featured article</h2>
        <v-card
          :to="`/page/${contentLanguage}/${article.normalizedtitle}`"
          class="overflow-hidden"
          v-for="article in [...tfa]"
          :key="article.pageid"
        >
          <v-row class="overflow-hidden">
            <v-col class="pa-0 ma-0" cols="12" lg="4" md="4" sm="4">
              <v-img
                :src="
                  article.thumbnail
                    ? article.thumbnail.source
                    : require('@/assets/Wikipedia logo version 2.svg?lazy')
                "
                cover
              >
              </v-img>
            </v-col>
            <v-col class="pa-0 ma-0" cols="12" lg="8" md="8" sm="6">
              <v-card-title>
                <h3 class="headline" v-html="article.displaytitle" />
              </v-card-title>
              <v-card-text>
                <h4>{{ article.description }}</h4>
                <p class="body" v-html="article.extract_html"></p>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md9 lg9>
        <h2><v-icon>mdi-trending-up</v-icon>Trending</h2>
        <v-slide-group multiple>
          <v-slide-item
            v-for="article in [...mostreadArticles]"
            :key="article.pageid"
          >
            <v-card
              max-width="300px"
              min-width="300px"
              :to="`/page/${contentLanguage}/${article.normalizedtitle}`"
              class="ma-2 overflow-y-hidden"
            >
              <v-img
                :src="
                  article.thumbnail
                    ? article.thumbnail.source
                    : require('@/assets/Wikipedia logo version 2.svg?lazy')
                "
                cover
                height="300px"
              >
                <v-row class="fill-height align-end " style="opacity: 0.85;">
                  <v-col class="px-2 py-0 ma-0">
                    <v-card-title
                      class="pa-0 px-2 grey darken-3 white--text overflow-hidden text-no-wrap"
                    >
                      <h3 class="headline mb-0" v-html="article.displaytitle" />
                    </v-card-title>
                    <v-card-text
                      class="extract px-2 text-xs-left overflow-hidden text-no-wrap grey darken-3 white--text"
                    >
                      <h4>{{ article.description }}</h4>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-img>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Home",
  data: () => ({
    mostreadArticles: [],
    tfa: []
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
        this.tfa = response.data.tfa ? [response.data.tfa] : [];
      });
    }
  }
};
</script>
