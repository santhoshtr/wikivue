<template>
  <header
    class="artcle-header"
  >
    <v-card-text
      class="mx-0 px-0"
    >
      <h1
        class="text--primary"
        fixed
      >
        {{ title }}
      </h1>
      <h3>
        {{ description }}
      </h3>
      <v-divider />
      <div>
        Last modified by {{ lastmodifier.user }} at {{ lastmodified }}
      </div>
    </v-card-text>
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
.artcle-header h1 {
  font-family: "Libertinus Serif", "Gentium", Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 24px;
  line-height: 1.2;
}

</style>
