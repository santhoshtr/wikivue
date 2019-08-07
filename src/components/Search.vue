<template>
  <v-autocomplete
    v-model="article"
    :items="articles"
    :loading="isLoading"
    :search-input.sync="search"
    hide-selected
    hide-no-data
    item-text="title"
    item-value="title"
    placeholder="Search"
    prepend-inner-icon="search"
    return-object
    flat
    single-line
    hide-details
    label="Search"
    @change="onSelect"
  >
    <template v-slot:append-outer>
      <LanguageSelector />
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item" />
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img
            v-if="data.item.thumbnail"
            :src="data.item.thumbnail.source"
          >
          <v-icon
            v-else
            large
          >
            description
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
import LanguageSelector from "./LanguageSelector";
import { mapGetters, mapState, mapMutations } from 'vuex';
import debounce from "debounce";
import axios from "axios";

export default {
  name: "Search",
  components: {
    LanguageSelector
  },
  data: () => ({
    articles: [], // search results
    isLoading: false,
    article: null,
    search: "",
  }),
  watch: {
    $route(to, from) {
     const contentLanguage = to.meta.language || this.contentLanguage;
     this.$store.commit('app/setContentLanguage', contentLanguage)
    },
    search(value) {
      if (!value) {
        return;
      }
      // Debounce the input
      debounce(this.wikiSearch, 1000)(value);
    }
  },
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
    })
  },
  methods: {
    onSelect: function(selected) {
      if (selected && selected.title) {
        this.$router.push({
          path: `/${this.contentLanguage || "en"}/${selected.title}`
        });
      }
    },
    wikiSearch: async function(value) {
      const api = `//${this.contentLanguage}.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch=${value}&prop=pageimages|description&piprop=thumbnail&pithumbsize=50&pilimit=10&format=json&formatversion=2&origin=*`;
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
     ...mapMutations([
      'setContentLanguage'
    ])
  }
};
</script>

