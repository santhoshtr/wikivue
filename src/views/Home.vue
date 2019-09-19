<template>
  <v-layout
    justify-center
    wrap
    row
    class="px-2 ma-2"
    align-center
  >
    <v-card
      width="30%"
      max-width="400px"
      min-width="400px"
      :to="`/page/${contentLanguage}/${article.title}`"
      class="ma-2 overflow-y-hidden"
      height="50vh"
      v-for="article in [...tfa, ...mostreadArticles]"
      :key="article.pageid"
    >
      <v-img
        :src="article.thumbnail? article.thumbnail.source:require('@/assets/Wikipedia logo version 2.svg?lazy')"
        cover
        aspect-ratio="2.5"
      />

      <v-card-title>
        <h3
          class="headline mb-0"
          v-html="article.displaytitle"
        />
      </v-card-title>
      <v-card-text class="extract text-xs-left overflow-y-hidden mb-2 pb-2">
        <h4>{{ article.description }}</h4>
        <p v-html="article.extract_html" />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState, mapMutations } from "vuex";

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
      const api = `https://${this.contentLanguage}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
      axios.get(api).then(response => {
        this.mostreadArticles = response.data.mostread.articles;
        this.tfa = response.data.tfa? [response.data.tfa] : [];
      });
    }
  }
};
</script>
