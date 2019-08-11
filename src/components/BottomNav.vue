<template>
  <v-sheet>
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

      <v-btn
        v-show="sharable"
        value="sharable"
      >
        <v-icon>share</v-icon>
      </v-btn>
      <v-btn
        v-show="$vuetify.breakpoint.smAndDown"
        value="tocbutton"
        @click="showToc"
      >
        <v-icon>list</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-navigation-drawer
      v-model="tocShown"
      right
      hide-overlay
      clipped
      app
      class="toc-drawer"
    >
      <table-of-contents :toc="toc" />
    </v-navigation-drawer>
  </v-sheet>
</template>


<script>
import TableOfContents from "./TOC";

export default {
  name: "BottomNav",
  components: {
    TableOfContents,
  },
  data() {
    return {
      bottomNav: "recent",
      tocShown: false,
       items: [
        { title: 'Click Me' },

        { title: 'Click Me 2' },
      ],
    };
  },
  computed:{
    sharable(){
      return navigator.share;
    },
    toc(){
      return this.$store.state.article.toc
    }
  },
  methods: {
    showToc(){
      this.tocShown=true;
    },
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
<style>
.toc-drawer .toc {
  max-width: 100%;
}
</style>