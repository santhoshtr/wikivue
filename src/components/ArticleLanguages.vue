<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        value="languages"
        v-on="on"
      >
        <v-badge right>
          <span slot="badge">{{ $store.state.article.languagecount }}</span>
          <v-icon>translate</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-container grid-list-md>
        <v-toolbar flat>
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchQuery"
            flat
            single-line
            hide-details
            prepend-inner-icon="search"
            @input="onSearch"
            class="language-search"
            label="Select language"
          />
        </v-toolbar>
        <v-list
          two-line
          subheader
        >
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, index) in (filteredLanguages ||articleLanguages)"
              :key="index"
              @click="selectLanguage(item.lang, item.titles.normalized )"
            >
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ item.titles.normalized }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ autonym(item.lang) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import languagedata from "language-data";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "ArticleLanguages",
  data: () => ({
    dialog: false,
    searchQuery: "",
    filteredLanguages: null
  }),
  computed: {
    ...mapState({
      articleLanguages: state => state.article.metadata.language_links
    })
  },
  methods: {
    autonym: function(lang) {
      return languagedata.getAutonym(lang);
    },
    onSearch: function() {
      this.filteredLanguages = this.articleLanguages.filter(item => {
        return item.lang
          .toLowerCase()
          .startsWith(this.searchQuery.toLowerCase());
      });
    },
    selectLanguage: function(language, title) {
      this.$store.commit("app/setContentLanguage", language);
      this.dialog = false;
      this.$router.push(`/page/${language}/${title}`);
      window.scrollTo(0, 0);
    }
  }
};
</script>
