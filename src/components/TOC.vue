<template>
  <div
    class="toc"
    v-if="toc.length>1"
  >
    <h1
      class="title"
      v-i18n="'toc-heading'"
    />
    <v-treeview
      activatable
      selection-type="independent"
      hoverable
      transition
      dense
      :active.sync="activeToc"
      :items="toc"
    />
  </div>
</template>

<script>
export default {
  name: 'TOC',
  props: {
    toc: {
      type: Array,
      default: ()=>([])
    }
  },
  data: () => ({
    activeToc: [],
  }),
  computed: {
    selectedToc() {
      if (!this.activeToc.length) {
        return undefined;
      }
      return this.activeToc[0];
    }
  },
  watch: {
    selectedToc: "gotoSection"
  },
  methods: {
   gotoSection(anchor) {
      if (anchor) {
        document.getElementById(anchor).scrollIntoView();
      }
    }
  }
}
</script>


<style scoped>
.toc {
    font-family: "Libertinus Serif", "Gentium", Georgia, Cambria,"Times New Roman", Times, serif;
    position: fixed;
    max-height: 100vh;
    max-width: 20%;
    overflow-y: auto;
    scrollbar-width: thin;
}
.v-treeview-node__content {
  cursor: pointer;
}
</style>
