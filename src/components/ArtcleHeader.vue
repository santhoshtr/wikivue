<template>
  <div
    class="artcle-header mb-5"
  >
    <h1
      class="display-3"
      fixed
    >
      {{ title }}
    </h1>
    <h3 class="subtitle-1">
      {{ description }}
    </h3>
  </div>
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
    }
  }
}
</script>


<style lang="less">
.artcle-header{
    font-family: Georgia, 'Times New Roman', Times, serif
}
</style>
