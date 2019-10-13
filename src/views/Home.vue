<template>
  <v-layout justify-center wrap row class="ma-auto" align-center>
    <v-card
      max-width="300px"
      min-width="300px"
      :to="`/page/${contentLanguage}/${article.normalizedtitle}`"
      class="ma-2 overflow-y-hidden"
      height="300px"
      v-for="article in [...tfa, ...mostreadArticles]"
      :key="article.pageid"
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
  </v-layout>
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
