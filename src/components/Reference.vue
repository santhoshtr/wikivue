<template>
  <v-bottom-sheet
    v-model="shown"
  >
    <v-sheet>
      <v-layout
        align-center
        justify-center
        row
        fill-height
        class="reference-content px-2 py-4"
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
          this.shown=!!this.reference
      }
  }
};
</script>
<style>
.reference-content {
     font-family: "Libertinus Serif", "Gentium", Georgia, Cambria,
    "Times New Roman", Times, serif;
    font-size: 1.2em;
}
</style>
