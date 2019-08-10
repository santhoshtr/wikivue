<template>
  <v-bottom-sheet
    hide-overlay
    v-model="shown"
  >
    <v-sheet class="article-preview">
      <div class="text-center">
        <v-btn
          block
          @click="read"
          color="grey lighten-3"
        >
          <v-icon>expand_less</v-icon>Read article
        </v-btn>
      </div>
      <preview-content
        :article="preview"
        :is-preview="true"
      />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>

export default {
  name: "ArticlePreview",
  data: () => ({
    shown: false
  }),
  props: {
    preview: {
      type: Object,
      default: () => null
    }
  },
  components: {
    // Recursive component - must be named and imported like this to
    // avoid many issues in build.
    'preview-content':  () => import('./ArticleContent')
  },
  watch: {
    preview: function() {
      this.shown = !!this.preview;
    }
  },
  methods: {
    read() {
        this.shown=false;
        document.documentElement.scrollTop = 0; //scroll to top
        this.$router.push(`/page/${this.$store.state.app.contentLanguage}/${this.preview.title}`);
    }
  }
};
</script>

<style>
.article-preview {
  height: 33vh;
}
</style>
