<template>
  <v-bottom-sheet
    :fullscreen="fullscreen"
    v-model="shown"
  >
    <v-btn
      small
      block
      @click="onRead"
    >
      <v-icon>mdi-arrow-collapse-up</v-icon>Read article
    </v-btn>
    <v-sheet class="article-preview m1-1">
      <preview-content
        :article="preview"
        :is-preview="true"
      />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ArticlePreview",
  data: () => ({
    shown: false,
    fullscreen: false
  }),
  props: {
    preview: {
      type: Object,
      default: () => null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // Recursive component - must be named and imported like this to
    // avoid many issues in build.
    "preview-content": () => import("./ArticleContent")
  },
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    })
  },
  watch: {
    show: function() {
      this.shown = this.show;
    },
    shown: function() {
      if (!this.shown) {
        this.$emit("close");
      }
    }
  },
  methods: {
    onRead: function() {
      this.fullscreen = true;
      setTimeout(() => {
        this.shown = false;
        this.fullscreen = false;
      }, 100);
      this.$router.push(`/page/${this.contentLanguage}/${this.preview.title}`);
    }
  }
};
</script>

<style>
.article-preview {
  height: 33vh;
}
</style>
