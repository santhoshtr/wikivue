<template>
  <v-layout
    row
    wrap
    class="px-auto mx-auto"
    align-center
  >
    <v-card
      width="30%"
      max-width="400px"
      min-width="400px"
      :to="`/page/${contentLanguage}/${article.title}`"
      class="ma-2  overflow-y-hidden"
      height="50vh"
      v-for="article in mostreadArticles"
      :key="article.pageid"
    >
      <v-img
        v-if="article.thumbnail"
        :src="article.thumbnail.source"
        cover
        aspect-ratio="2"
      />

      <v-card-title>
        <h3
          class="headline mb-0"
          v-html="article.displaytitle"
        />
      </v-card-title>
      <v-card-text class="extract text-xs-left overflow-y-hidden mb-2 pb-2">
        <h4>
          {{ article.description }}
        </h4>
        <p
          v-html="article.extract_html"
        />
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: 'Home',
  data:() => ({
    mostreadArticles:[]
    }),
    computed:{
      ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      preview: state => state.preview
    })
    },
      watch: {
    contentLanguage: function() {
       const today= new Date();
      this.feed(today.getFullYear(), ('0'+today.getMonth()).slice(-2), ('0'+today.getDate()).slice(-2));
    }
      },
  mounted: function(){
      const today= new Date();
      this.feed(today.getFullYear(), ('0'+today.getMonth()).slice(-2), ('0'+today.getDate()).slice(-2));
  },
  methods:{
    feed(year, month, date){
      const api=`https://${this.contentLanguage}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
      axios
        .get(api)
        .then(response => {
          this.mostreadArticles=response.data.mostread.articles;
        })
    }
  }
}
</script>
