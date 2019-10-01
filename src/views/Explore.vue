<template>
  <v-layout
    justify-center
    wrap
    row
    class="ma-auto"
    align-center
  >
    <v-container>
      <v-item-group
        mandatory
        v-model="selected"
      >
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <h2 class="title">
              Choose your interested topics
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="item in topics"
            :key="item.wd"
            cols="12"
            md="2"
            sm="4"
          >
            <v-item
              :value="item.wd"
              v-slot:default="{ active, toggle }"
            >
              <v-card @click="toggle">
                <v-img
                  :src="item.image"
                  height="80"
                  width="100%"
                  cover
                />
                <v-card-title class="pa-0">
                  <v-btn icon>
                    <v-icon>{{ active ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                  </v-btn>
                  <h3
                    class="title mb-0 overflow-y-hidden"
                    v-text="item.name"
                  />
                </v-card-title>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
    <!--- Articles in that category --->

    <v-layout
      justify-center
      wrap
      row
      class="ma-auto"
      align-center
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <h2 class="title">
            Articles from selected topic
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="article in articles"
          :key="article.item.value"
          cols="12"
          md="3"
          sm="4"
        >
          <v-card
            class="ma-2"
            :to="`/page/${contentLanguage}/${article.itemLabel.value}`"
          >
            <v-img
              :src="article.image? article.image.value:require('@/assets/Wikipedia logo version 2.svg?lazy')"
              cover
              aspect-ratio="2.5"
            />
            <v-card-title>
              <h3
                class="title mb-0 overflow-y-hidden"
                v-text="article.itemLabel.value"
              />
            </v-card-title>
            <v-card-text
              v-if="article.itemDescription"
              class="extract text-xs-left overflow-y-hidden"
            >
              <h4>{{ article.itemDescription.value }}</h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-layout>
</template>

<script>
import topics from "../wiki/topics.json";
import { fetchTopicsInCategory } from "../wiki/api/wikidata";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Explore",
  data: () => ({
    topics,
    selected: null,
    articles: []
  }),
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    })
  },
  watch: {
    selected: function() {
      this.fetchArticles(this.selected);
    }
  },
  methods: {
    fetchArticles: function(selected) {
      fetchTopicsInCategory(selected, this.contentLanguage, 20).then(
        response => {
          this.articles = response.data.results.bindings;
          console.log(this.articles);
        }
      );
    }
  }
};
</script>
