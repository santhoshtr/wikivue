<template>
  <v-text-field
    v-model="query"
    flat
    single-line
    hide-details
    class="title"
    label="Search"
    @keydown.enter="onSearch"
  >
    <template v-slot:prepend-inner>
      <v-btn
        text
        @click="onSearch"
      >
        <v-icon>search</v-icon>
      </v-btn>
    </template>
    <template v-slot:append>
      <LanguageSelector
        :selected-language="language"
        @changeLanguage="onChangeLanguage"
      />
    </template>
  </v-text-field>
</template>

<script>
import LanguageSelector from "./LanguageSelector";

export default {
  name: "Search",
  components: {
    LanguageSelector
  },
  data: () => ({
    query: "",
    language: "en"
  }),
  watch: {
    $route(to, from) {
      this.language = to.meta.language|| this.language;
      this.query = to.params.title;
    }
  },
  methods: {
    onChangeLanguage: function(language) {
      this.language = language;
    },
    onSearch: function() {
      this.$router.push({ path: `/${this.language}/${this.query}` });
    }
  }
};
</script>

