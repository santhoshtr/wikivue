<template>
  <v-autocomplete
    v-model="article"
    id="wikip-search"
    :items="articles"
    :loading="isLoading ? 'blue' : false"
    :search-input.sync="search"
    :menu-props="{ maxHeight: '80vh' }"
    hide-selected
    clearable
    item-text="title"
    item-value="title"
    :placeholder="$i18n('header-search')"
    return-object
    auto-select-first
    attach=".search"
    rounded
    filled
    single-line
    hide-details
    label="Search"
    class="search lg12"
    @change="onSelect"
  >
    <template v-slot:prepend-inner>
      <v-icon>{{ mdiMagnify }}</v-icon>
    </template>
    <template v-slot:no-data>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <v-row class="align-center">
              <v-col> What would you like to know? </v-col>
              <v-col> <language-selector /></v-col>
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
            <v-list-item-icon>
              <v-icon>{{ mdiFileDocumentBox }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
              <v-list-item-subtitle v-html="item.description" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item" />
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img v-if="data.item.thumbnail" :src="data.item.thumbnail.source" />
          <v-icon v-else large>
            {{ mdiFileDocumentBox }}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.title" />
          <v-list-item-subtitle v-html="data.item.description" />
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { mdiMagnify, mdiFileDocumentBox } from "@mdi/js";
import axios from "axios";

export default {
  name: "Search",
  components: {
    LanguageSelector: () => import("./LanguageSelector")
  },
  data: () => ({
    articles: [], // search results
    isLoading: false,
    article: null,
    search: "",
    drawer: false,
    mdiMagnify,
    mdiFileDocumentBox
  }),
  watch: {
    $route(to) {
      const contentLanguage = to.meta.language || this.contentLanguage;
      this.$store.commit("app/setContentLanguage", contentLanguage);
    },
    search(value) {
      if (!value) {
        return;
      }
      this.wikiSearch(value);
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
        window.scrollTo(0, 0);
      }
    },
    wikiSearch: async function(value) {
      const api = `https://${
        this.contentLanguage
      }.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch=${value}&prop=pageimages|description&piprop=thumbnail&pithumbsize=50&pilimit=10&format=json&formatversion=2&origin=*`;
      // Handle empty value
      if (!value) {
        this.articles = [];
        this.person = null;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.articles = await axios
        .get(api)
        .then(response => {
          return response.data.query.pages;
        })
        .finally(() => (this.isLoading = false));
    },
    ...mapMutations(["setContentLanguage"])
  }
};
</script>
