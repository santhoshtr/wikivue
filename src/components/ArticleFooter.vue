<template>
  <header
    class="artcle-header"
  >
    <v-layout
      row
      class="mx-0 pa-0"
    >
      <v-flex
        xs12
        sm12
        md12
        lg12
      >
        <h2
          class="text--primary"
          fixed
          v-i18n="'categories-title'"
        />

        <v-list rounded>
          <v-list-item
            v-for="(item, index) in categories"
            :key="index"
            link
            :to="'Category:'+item.titles.display"
          >
            <v-list-item-title>{{ item.titles.display }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
export default {
  name: 'ArticleHeader',
  props: {
    article: {
      type: Object,
      default: () => null
    }
  },
  computed:{
    loaded: function() {
      return (
        this.article.loadingStatus === "success" ||
        this.article.loadingStatus === "failure"
      );
    },
    categories:function(){
      const allCategories = this.article.metadata?this.article.metadata.categories||[]:[];
      return allCategories.filter(category=>category.hidden===false)
    },
    categoriesCount: function(){
      return this.categories.length
    }
  }
}
</script>
