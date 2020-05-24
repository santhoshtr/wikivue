<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn text :title="selectedLanguageAutonym" v-on="on">
        <v-icon :title="selectedLanguageAutonym">{{ mdiTranslate }}</v-icon>
        <template v-if="$vuetify.breakpoint.mdAndUp">{{
          selectedLanguageAutonym
        }}</template>
      </v-btn>
    </template>
    <v-card>
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
</template>

<script>
import languagedata from "@wikimedia/language-data";
import { mdiClose, mdiArrowLeft, mdiMagnify, mdiTranslate } from "@mdi/js";
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
    searchQuery: "",
    mdiClose,
    mdiMagnify,
    mdiArrowLeft,
    mdiTranslate
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
