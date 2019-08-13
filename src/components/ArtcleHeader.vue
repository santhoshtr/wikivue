<template>
  <header
    class="artcle-header"
  >
    <v-flex
      xs12
      sm12
      md8
      lg8
    >
      <v-card-text
        class="mx-0 pa-0"
      >
        <h1
          class="text--primary"
          fixed
        >
          {{ title }}
        </h1>
        <h3 class="font-weight-regular">
          {{ description }}
        </h3>
        <v-divider />
        <div>
          Last modified by {{ lastmodifier.user }} at {{ lastmodified }}
        </div>
      </v-card-text>
    </v-flex>
  </header>
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
    lastmodified:{
      type: String,
      default: ""
    },
    lastmodifier:{
      type: Object,
      default: ()=> ({})
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
  h1 {
    font-family: "Libertinus Serif", "Gentium", Georgia, Cambria, "Times New Roman", Times, serif;
    font-size: 2.0em;
    line-height: 1.2;
  }
  h3{
    font-size: 20px;
  }
}

</style>
