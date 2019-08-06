<template>
  <div
    class="toc"
    v-if="toc.length"
  >
    <h1
      class="title"
    >
      Table of contents
    </h1>
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


<style>
.toc {
    position: fixed;
    max-height: 100vh;
    overflow-y: auto;
    scrollbar-width: thin;
}
.v-treeview-node__content {
  cursor: pointer;
}
</style>
