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
    <v-card>
      <v-img
        contain
        :src="image.original.url"
        aspect-ratio="1"
        :width="image.original.width"
        :height="image.original.height"
      />
      <v-card-title>
        <a :href="image.file_description_url">{{ image.title }}</a> by
        {{ image.latest.user.name }}
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from "@mdi/js";
import Article from "../wiki/models/article";
export default {
  name: "ImageViewer",
  data: () => ({
    shown: true,
    mdiClose
  }),
  computed: {
    media() {
      return this.article.media;
    },
    image: function() {
      if (this.media && this.imgsrc) {
        return this.media.find(item => {
          return (
            item.title === this.imgsrc ||
            item.title === this.imgsrc.split(":").pop()
          );
        });
      }
      return null;
    }
  },
  props: {
    article: {
      type: Article
    },
    imgsrc: {
      type: String,
      default: null
    }
  },
  watch: {
    imgsrc: function() {
      this.shown = !!this.imgsrc && !!this.image;
    }
  }
};
</script>
