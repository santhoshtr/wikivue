<template>
  <v-layout justify-center>
    <v-btn
      text
      :title="selectedLanguageAutonym"
      @click.stop="dialog = true"
    >
      <v-icon>translate</v-icon>
      {{ $vuetify.breakpoint.smAndUp?selectedLanguageAutonym:contentLanguage }}
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
              v-for="(autonym, code) in contentLanguages"
              :key="code"
              xs12
              sm6
              md4
              lg3
              xl2
            >
              <v-btn
                text
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
import { mapGetters,mapState, mapMutations } from 'vuex';

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
    searchQuery: ""
  }),
  computed: {
    ...mapGetters('app',[
      'contentLanguages'
    ]),
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
    }),
    selectedLanguageAutonym:function(){
      return languagedata.getAutonym(this.contentLanguage);
    }
  },
  methods: {
    selectLanguage: function(language, autonym) {
      this.$store.commit('app/setContentLanguage',language)
      this.dialog = false;
    },
    onSearch: function() {
      this.filteredLanguages = {};
      Object.keys(this.languages).forEach(key => {
        if (
          key.toLowerCase() === this.searchQuery.toLowerCase()||
          (this.languages[key] &&
            this.languages[key].toLowerCase().startsWith(this.searchQuery.toLowerCase()))
        ) {
          this.filteredLanguages[key] = this.languages[key];
        }
      });
    }
  }
};
</script>
