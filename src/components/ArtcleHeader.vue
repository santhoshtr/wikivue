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
            {{ article.title }}
          </h1>
          <h3 class="font-weight-regular">
            {{ description }}
          </h3>
          <v-divider />
          <div v-if="loaded">
            Last modified by {{ lastmodifier.user }} at {{ lastmodified }}
          </div>
        </v-card-text>
      </v-flex>
      <v-flex
        hidden-sm-and-down
        md4
        lg4
      >
        <v-toolbar
          flat
          v-if="loaded"
        >
          <v-toolbar-items>
            <v-menu
              :if="categoriesCount>0"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  value="categories"
                  v-on="on"
                  text
                  small
                >
                  <v-badge
                    right
                    color="grey darken-3"
                  >
                    <span slot="badge">{{ categoriesCount }}</span>
                    <v-icon>bookmark_border</v-icon>
                  </v-badge>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Categories</v-subheader>
                <v-list-item
                  v-for="(item, index) in categories"
                  :key="index"
                >
                  <v-list-item-title>{{ item.titles.display }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </v-toolbar>
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
    description: function() {
      return this.article.description;
    },
    lastmodifier: function() {
      return this.article.history && this.article.history.lastmodifier;
    },
    lastmodified: function() {
      return this.article.history && new Date(this.article.history.lastmodified).toLocaleString();
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
