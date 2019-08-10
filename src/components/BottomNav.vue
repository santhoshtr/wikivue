<template>
  <v-bottom-navigation
    v-model="bottomNav"
    grow
    app
    hide-on-scroll
  >
    <v-btn value="recent">
      <v-icon>history</v-icon>
    </v-btn>

    <v-btn value="bookmark">
      <v-icon>bookmark</v-icon>
    </v-btn>

    <v-btn value="languages">
      <v-badge right>
        <span slot="badge">{{ $store.state.article.languagecount }}</span>
        <v-icon>translate</v-icon>
      </v-badge>
    </v-btn>

    <v-btn value="share">
      <v-icon>share</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>


<script>
export default {
  name: "BottomNav",
  data() {
    return {
      bottomNav: "recent"
    };
  },
  methods: {
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: this.$store.state.article.tilte,
            text: this.$store.state.article.description,
            url: document.URL
          })
          .then(() => console.log("Successful share"))
          .catch(error => console.log("Error sharing", error));
      }
    }
  }
};
</script>
