<template>
  <v-dialog
    v-model="shown"
  >
    <v-card>
      <v-img
        cover
        :src="image.src"
        :srcset="image.srcset"
        :height="image.height"
        :width="image.width"
      />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ImageViewer",
  data: () => ({
      shown: false,
  }),
  props: {
    image: {
      type: Object,
      default: ()=>({})
    }
  },
  watch:{
      image:function(){
          this.shown=!!this.image
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
