<template>
  <v-bottom-sheet
    hide-overlay
    v-model="shown"
  >
    <v-sheet class="article-preview">
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
    },
    show:{
      type: Boolean,
      default:false
    }
  },
  components: {
    // Recursive component - must be named and imported like this to
    // avoid many issues in build.
    'preview-content':  () => import('./ArticleContent')
  },
  watch: {
    show: function() {
      this.shown = this.show;
    }
  }
};
</script>

<style>
.article-preview {
  height: 33vh;
}
</style>
