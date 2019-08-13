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
