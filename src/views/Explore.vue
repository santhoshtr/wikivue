<template>
  <v-layout justify-center wrap row class="ma-auto" align-center>
    <v-container>
      <v-item-group mandatory v-model="selected">
        <v-row>
          <v-col cols="12" md="12">
            <h2 class="title">
              Choose your topics of interest
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="item in topics" :key="item.wd" cols="12" md="2" sm="4">
            <v-item :value="item.wd" v-slot:default="{ active, toggle }">
              <v-card @click="toggle">
                <v-img
                  :src="`${item.image}?width=300`"
                  height="100"
                  width="100%"
                  cover
                >
                  <v-row class="fill-height align-end">
                    <v-col class="px-2 py-0 ma-0">
                      <v-card-title
                        class="pa-0 grey darken-3"
                        style="opacity: 0.85;"
                      >
                        <v-btn icon>
                          <v-icon class="white--text">
                            {{ active ? "mdi-heart" : "mdi-heart-outline" }}
                          </v-icon>
                        </v-btn>
                        <h3
                          class="title mb-0 overflow-y-hidden white--text"
                          v-text="item.name"
                        />
                      </v-card-title>
                    </v-col>
                  </v-row>
                </v-img>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
    <!--- Articles in that category --->
    <v-progress-linear
      :active="!loaded"
      :indeterminate="!loaded"
      color="blue"
      absolute
      top
    />
    <v-layout justify-center wrap row class="ma-auto" align-center>
      <v-container>
        <h2 v-if="task === 'explore'" class="title">
          Articles from selected topic
        </h2>
        <h2 v-if="task === 'translate'" class="title">
          {{ selectedTopic }} articles to translate from
          {{ autonym(contentLanguage) }} to {{ autonym(targetLanguage) }}
        </h2>

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
              height="300px"
              :to="
                task === 'explore' &&
                  `/page/${contentLanguage}/${article.itemLabel.value}`
              "
              :href="
                task === 'translate' &&
                  `https://en.wikipedia.org/wiki/Special:CX?page=${article.itemLabel.value}&from=${contentLanguage}&to=${targetLanguage}`
              "
            >
              <v-img
                :lazy-src="
                  require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                "
                :src="
                  article.image
                    ? `${article.image.value}?width=300`
                    : require('@/assets/Wikipedia-logo-version-2.svg?lazy')
                "
                cover
                width="100%"
                height="300px"
              >
                <v-row class="fill-height align-end " style="opacity: 0.85;">
                  <v-col class="px-2 py-0 ma-0">
                    <v-card-title
                      class="pa-0 px-2 grey darken-3 white--text overflow-hidden text-no-wrap"
                    >
                      <h3
                        class="title overflow-hidden "
                        v-text="article.itemLabel.value"
                      />
                    </v-card-title>
                    <v-card-text
                      v-if="article.itemDescription"
                      class="extract px-2 text-xs-left overflow-hidden text-no-wrap grey darken-3 white--text"
                    >
                      <h4>{{ article.itemDescription.value }}</h4>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-layout>
  </v-layout>
</template>

<script>
import topics from "../wiki/topics.json";
import languagedata from "@wikimedia/language-data";

import {
  fetchTopicsInCategory,
  fetchTopicsInCategoryForTranslate
} from "../wiki/api/wikidata";
import { mapState } from "vuex";

export default {
  name: "Explore",
  data: () => ({
    topics,
    selected: null,
    articles: [],
    task: "explore",
    loaded: true,
    targetLanguage: null
  }),
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    }),
    selectedTopic: function() {
      const topic = topics.find(item => item.wd == this.selected);
      return topic.name;
    }
  },
  watch: {
    selected: function() {
      if (this.task === "explore") {
        this.fetchArticles(this.selected);
      }
      if (this.task === "translate") {
        this.fetchArticlesForTranslate(this.selected, this.targetLanguage);
      }
    },
    task: function() {
      if (this.task === "translate") {
        this.fetchArticlesForTranslate(this.selected, this.targetLanguage);
      }
    }
  },
  methods: {
    fetchArticles: function(selected) {
      this.loaded = false;
      this.articles = [];
      fetchTopicsInCategory(selected, this.contentLanguage, 30).then(
        response => {
          this.articles = this.deduplicate(response.data.results.bindings);
          this.loaded = true;
        }
      );
    },
    fetchArticlesForTranslate: function(selected, targetLanguage) {
      this.loaded = false;
      this.articles = [];
      fetchTopicsInCategoryForTranslate(
        selected,
        this.contentLanguage,
        30,
        targetLanguage
      ).then(response => {
        this.articles = this.deduplicate(response.data.results.bindings);
        this.loaded = true;
      });
    },
    init: function(task = "explore", targetLanguage) {
      this.task = task;
      this.targetLanguage = targetLanguage;
    },
    autonym: function(lang) {
      return languagedata.getAutonym(lang);
    },
    deduplicate: function(arr) {
      return arr.filter(
        (v, i, a) => a.findIndex(t => t.item.value === v.item.value) === i
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    const task = to.meta.task;
    const language = to.params.target;
    next(vm => {
      vm.init(task, language);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    const task = to.meta.task;
    const language = to.params.target;
    this.init(task, language);
    next();
  },
  beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    next();
  }
};
</script>
