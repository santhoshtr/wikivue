<template>
  <v-dialog fullscreen hide-overlay v-model="shown">
    <v-toolbar>
      <v-toolbar-title>Image</v-toolbar-title>
      <div class="flex-grow-1" />
      <v-toolbar-items>
        <v-btn text @click="shown = false">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card :if="shown">
      <v-img
        contain
        :src="image && image.original.source"
        aspect-ratio="1"
        width="auto"
        height="80vh"
      />
      <v-card-title v-html="image && image.description.html" />
      <v-card-text v-html="image && image.artist.html" />
      <v-card-text v-html="image && image.credit.html" />
      <v-card-text v-text="image && image.license.type" />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mdiClose } from "@mdi/js";

export default {
  name: "ImageViewer",
  data: () => ({
    shown: false,
    mdiClose
  }),
  computed: {
    ...mapState({
      media: state => state.article.media
    }),
    image: function() {
      if (this.media.items) {
        return this.media.items.find(item => {
          return item.titles && item.titles.canonical === this.imgsrc;
        });
      }
      return null;
    }
  },
  props: {
    imgsrc: {
      type: String,
      default: null
    }
  },
  watch: {
    image: function() {
      this.shown = !!this.imgsrc;
    }
  }
};
</script>
