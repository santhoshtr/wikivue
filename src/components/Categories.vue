<template>
  <v-flex xs12 sm12 md12 lg12>
    <v-expansion-panels
      accordion
      focusable
      class="flex md12 lg12 xs12 sm12 my-10"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h2>{{ $i18n("categories-title") }}</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list rounded>
            <v-list-item
              v-for="(item, index) in categoriesToShow"
              :key="index"
              link
              :to="'Category:' + item.titles.display"
            >
              <v-list-item-title>
                <v-icon>mdi-tag</v-icon>
                {{ item.titles.display }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-flex>
</template>

<script>
export default {
  name: "Categories",
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    categoriesToShow: function() {
      return this.categories.filter(category => category.hidden === false);
    },
    categoriesCount: function() {
      return this.categoriesToShow.length;
    }
  }
};
</script>
