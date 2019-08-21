<template>
  <v-dialog
    v-model="shown"
  >
    <v-card>
      <v-img
        cover
        :if="image"
        :src="image.original.source"
        aspect-ratio="1"
        width="100%"
        height="auto"
      />
      <v-card-title v-html="image.artist.html" />
      <v-card-text v-html="image.description.html" />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "ImageViewer",
  data: () => ({
      shown: false,
  }),
  computed:{
    ...mapState({
      media: state => state.article.media
    }),
    image: function(){
        if(this.media.items){
            return this.media.items.find(item=>{
                return item.titles.canonical===this.imgsrc;
            })
        }
        return null;
    }
  },
  props: {
    imgsrc: {
      type: String,
      default: null,
    }
  },
  watch:{
      image:function(){
          this.shown=!!this.imgsrc
      }
  }
};
</script>
<style>
.reference-content {
     font-family: "Libertinus Serif", "Gentium", Georgia, Cambria,
    "Times New Roman", Times, serif;
}
</style>
