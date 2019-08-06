<template>
  <v-card
    flat
    class="artcle-header mb-5"
  >
    <h1
      fixed
    >
      {{ title }}
    </h1>
    <h3 class="subtitle-1">
      {{ description }}
    </h3>
  </v-card>
</template>

<script>
export default {
  name: 'ArticleHeader',
  props: {
    title: {
      type: String,
      default: ()=>this.$router.params.title
    },
     description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
  }
}
</script>


<style lang="less">
.artcle-header {
  font-family: "Libertinus Serif", "Gentium", Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 24px;
  line-height: 1.2;
}

</style>
