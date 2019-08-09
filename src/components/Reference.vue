<template v-if="$vuetify.breakpoint.smAndUp">
  <v-bottom-sheet
    hide-overlay
    v-model="shown"
  >
    <v-sheet
      height="200px"
    >
      <v-layout
        align-center
        justify-center
        row
        fill-height
        class="reference-content"
      >
        <v-flex
          xs12
          sm12
          md6
          lg6
        >
          <p
            v-html="reference"
          />
        </v-flex>
      </v-layout>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: "Reference",
  data: () => ({
      shown: false,
  }),
  props: {
    reference: {
      type: String,
      default: null
    }
  },
  watch:{
      reference:function(){
          if(this.reference){
          this.shown=true
          }
      }
  }
};
</script>
<style>
.reference-content {
    overflow-y: auto;
}
</style>
