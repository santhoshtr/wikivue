<template>
  <div class="toc">
    <h1
      class="title font-weight-light"
      fixed
    >
      Table of contents
    </h1>
    <v-treeview
      dense
      activatable
      selection-type="independent"
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
    position: sticky;
    top: 4em;
}
</style>
