<template>
  <v-layout justify-center>
    <v-btn
      text
      :title="selectedLanguageAutonym"
      @click.stop="dialog = true"
    >
      <v-icon>translate</v-icon>
      {{ selectedLanguage }}
    </v-btn>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
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
        <v-container
          grid-list-md
          text-center
        >
          <v-layout wrap>
            <v-flex
              v-for="(autonym, code) in filteredLanguages"
              :key="code"
              xs12
              sm6
              md4
              lg3
              xl2
            >
              <v-btn
                text
                small
                @click="selectLanguage(code, autonym)"
              >
                {{ autonym }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import languagedata from "language-data";
import wikicodes from "../lib/wikipedia-codes.json";

export default {
  name: "LanguageSelector",
  props: {
    selectedLanguage: {
      type: String,
      default: "en"
    }
  },
  data: () => ({
    dialog: false,
    languages: {},
    filteredLanguages: {},
    selectedLanguageAutonym: "English",
    searchQuery: ""
  }),
  mounted: function() {
    for (let i = 0; i < wikicodes.length; i++) {
      this.languages[wikicodes[i]] = languagedata.getAutonym(wikicodes[i]);
    }
    this.filteredLanguages = this.languages;
  },
  methods: {
    selectLanguage: function(language, autonym) {
      this.selectedLanguage = language;
      this.selectedLanguageAutonym = autonym;
      this.$emit("changeLanguage", language, autonym);
      this.dialog = false;
    },
    onSearch: function() {
      this.filteredLanguages = {};
      Object.keys(this.languages).forEach(key => {
        if (
          key === this.searchQuery ||
          (this.languages[key] &&
            this.languages[key].startsWith(this.searchQuery))
        ) {
          this.filteredLanguages[key] = this.languages[key];
        }
      });
    }
  }
};
</script>
