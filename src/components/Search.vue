<template>
  <v-dialog v-model="dialog" fullscreen transition="slide-x-reverse-transition">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        flat
        single-line
        :placeholder="$i18n('header-search')"
        auto-select-first
        solo
        hide-details
        label="Search"
      >
        <template v-slot:prepend-inner>
          <v-icon>{{ mdiMagnify }}</v-icon>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-app-bar flat>
        <v-app-bar-nav-icon @click.stop="dialog = !dialog">
          <v-icon>{{ mdiArrowLeft }}</v-icon>
        </v-app-bar-nav-icon>
        <brand />
        <v-spacer v-if="$vuetify.breakpoint.lgAndUp" />

        <v-text-field
          v-model.trim.lazy="search"
          :loading="isLoading ? 'blue' : false"
          flat
          single-line
          solo
          hide-details
          @input="wikiSearch"
          :placeholder="$i18n('header-search')"
          :prepend-inner-icon="mdiMagnify"
          class="article-search"
          autofocus
        >
        </v-text-field>
        <v-spacer v-if="$vuetify.breakpoint.lgAndUp" />
        <language-selector />
      </v-app-bar>
      <v-container grid-list-md>
        <v-list v-if="articles.length === 0 || !this.search">
          <v-list-item>
            <v-list-item-title>
              <v-row class="align-center">
                <v-col> What would you like to know? </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>
          <v-subheader v-if="articlesHistory.length">
            Recently viewed articles
          </v-subheader>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, i) in articlesHistory"
              :key="i"
              :to="item.title"
            >
              <v-list-item-avatar>
                <img v-if="item.thumbnail" :src="item.thumbnail.source" />
                <v-icon v-else large> {{ mdiFileDocumentBox }} </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
                <v-list-item-subtitle v-html="item.description" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list v-if="articles.length && this.search">
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, i) in articles"
              :key="i"
              @click="onSelect(item)"
            >
              <v-list-item-avatar>
                <img v-if="item.thumbnail" :src="item.thumbnail.source" />
                <v-icon v-else large> {{ mdiFileDocumentBox }} </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
                <v-list-item-subtitle v-html="item.description" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { mdiMagnify, mdiArrowLeft, mdiFileDocumentBox } from "@mdi/js";
import generalApi from "../wiki/api/general";

export default {
  name: "Search",
  data: () => ({
    articles: [], // search results
    isLoading: false,
    article: null,
    search: "",
    dialog: false,
    mdiMagnify,
    mdiArrowLeft,
    mdiFileDocumentBox
  }),
  components: {
    Brand: () => import("./Brand"),
    LanguageSelector: () => import("./LanguageSelector")
  },
  watch: {
    $route(to) {
      const contentLanguage = to.meta.language || this.contentLanguage;
      this.$store.commit("app/setContentLanguage", contentLanguage);
    }
  },
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      articlesHistory: state => state.app.articlesHistory.slice().reverse()
    })
  },
  methods: {
    onSelect: function(selected) {
      if (selected && selected.title) {
        this.$router.push({
          path: `/page/${this.contentLanguage || "en"}/${selected.title}`
        });
        this.dialog = false;
        window.scrollTo(0, 0);
      }
    },
    wikiSearch: async function(value) {
      // Handle empty value
      if (!value) {
        this.articles = [];
        this.isLoading = false;
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.articles = await generalApi
        .wikiSearch(this.contentLanguage, value)
        .finally(() => (this.isLoading = false));
    },
    ...mapMutations(["setContentLanguage"])
  }
};
</script>
