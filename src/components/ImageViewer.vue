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
        :src="image.srcset[0].src"
        :srcset="image && srcset"
        aspect-ratio="1"
        width="auto"
        height="90vh"
      />
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
          return item.title === this.imgsrc;
        });
      }
      return null;
    },
    srcset() {
      let srcsetStr = [];
      this.image.srcset.forEach(item => {
        srcsetStr.push([item.src, item.scale].join(" "));
      });
      return srcsetStr.join(",");
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
      this.shown = !!this.imgsrc;
    }
  }
};
</script>
