<template>
  <v-layout justify-center align-center>
    <v-btn text :title="selectedLanguageAutonym" @click.stop="dialog = true">
      <v-icon>mdi-translate</v-icon>
      {{ selectedLanguageAutonym }}
    </v-btn>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchQuery"
            flat
            single-line
            hide-details
            prepend-inner-icon="mdi-search"
            @input="onSearch"
            class="language-search"
            label="Select language"
          />
          <v-toolbar-items>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container grid-list-md text-center>
          <v-item-group>
            <v-row>
              <v-col
                v-for="(autonym, code) in filteredLanguages || contentLanguages"
                :key="code"
                cols="12"
                md="4"
                lg="3"
              >
                <v-item>
                  <v-btn text @click="selectLanguage(code, autonym)">{{
                    autonym
                  }}</v-btn>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import languagedata from "@wikimedia/language-data";
import { mapGetters, mapState } from "vuex";

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
    filteredLanguages: null,
    searchQuery: ""
  }),
  computed: {
    ...mapGetters("app", ["contentLanguages"]),
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    }),
    selectedLanguageAutonym: function() {
      return languagedata.getAutonym(this.contentLanguage);
    }
  },
  methods: {
    selectLanguage: function(language) {
      this.$store.commit("app/setContentLanguage", language);
      this.dialog = false;
    },
    onSearch: function() {
      this.filteredLanguages = {};
      Object.keys(this.contentLanguages).forEach(key => {
        if (
          key.toLowerCase() === this.searchQuery.toLowerCase() ||
          (this.contentLanguages[key] &&
            this.contentLanguages[key]
              .toLowerCase()
              .startsWith(this.searchQuery.toLowerCase()))
        ) {
          this.filteredLanguages[key] = this.contentLanguages[key];
        }
      });
    }
  }
};
</script>
