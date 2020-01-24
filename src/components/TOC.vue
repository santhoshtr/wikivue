<template>
  <div class="toc fill-height py-2 px-4" v-if="toc.length > 1">
    <h1 class="title px-2" v-i18n="'toc-heading'" />
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
  name: "TOC",
  props: {
    toc: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    activeToc: []
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
        this.$router.push(`#${anchor}`);
      }
    }
  }
};
</script>

<style>
.toc {
  position: sticky;
  top: 0;
  width: 100%;
  max-height: 100vh;
  max-width: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
}
.v-treeview-node__content {
  cursor: pointer;
}
</style>
