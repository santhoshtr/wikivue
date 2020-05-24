<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn text value="languages" v-on="on">
        <!-- <v-badge
          right
          color="blue"
        >
          <span
            slot="badge"
          >{{ $store.state.article.languagecount }}</span>
          <v-icon>{{mdiTranslate}}</v-icon>
        </v-badge> -->
        <v-icon>{{ mdiTranslate }}</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container grid-list-md>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>{{ mdiArrowLeft }}</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchQuery"
            flat
            single-line
            hide-details
            @input="onSearch"
            class="language-search"
            label="Select language"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{ mdiMagnify }}</v-icon>
            </template>
          </v-text-field>
          <v-toolbar-items>
            <v-btn icon @click="dialog = false">
              <v-icon>{{ mdiClose }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list two-line subheader>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, index) in filteredLanguages || articleLanguages"
              :key="index"
              @click="selectLanguage(item.lang, item.titles.normalized)"
            >
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ item.titles.normalized }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  autonym(item.lang)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import languagedata from "@wikimedia/language-data";
import { mdiClose, mdiArrowLeft, mdiMagnify, mdiTranslate } from "@mdi/js";
import { mapState } from "vuex";

export default {
  name: "ArticleLanguages",
  data: () => ({
    dialog: false,
    searchQuery: "",
    filteredLanguages: null,
    mdiClose,
    mdiMagnify,
    mdiArrowLeft,
    mdiTranslate
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
