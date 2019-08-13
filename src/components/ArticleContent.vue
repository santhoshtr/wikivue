<template>
  <v-container fluid>
    <v-progress-linear
      :active="isPreview?!article.loaded:!loaded"
      :indeterminate="isPreview?!article.loaded:!loaded"
      absolute
      top
    />
    <v-layout
      row
      fill-height
      v-touch="{
        left: () => swipe('Left'),
        right: () => swipe('Right'),
      }"
    >
      <v-flex
        xs2
        sm2
        md3
        lg3
        hidden-sm-and-down
        class="px-2"
      >
        <table-of-contents :toc="toc" />
      </v-flex>
      <v-flex
        xs12
        sm12
        md9
        lg9
        class="px-2"
      >
        <article
          :lang="$store.state.app.contentLanguage"
          :if="loaded"
          class="px-2"
        >
          <article-header
            :title="displaytitle"
            :description="description"
            :lastmodifier="lastmodifier"
            :lastmodified="lastmodified"
          />
          <v-sheet class="content">
            <section
              v-for="section in sections"
              :key="section.id"
              :id="section.anchor"
              v-html="layout(section.html)"
              class="my-4 layout row fill-height"
            />
            <div
              class="error"
              :if="error"
            >
              {{ error }}
            </div>
          </v-sheet>
          <reference :reference="selectedReference" />
          <article-preview
            :preview="preview"
            :show="previewShown"
          />
        </article>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TableOfContents from "./TOC";
import ArticleHeader from "./ArtcleHeader";
import Reference from "./Reference";
import ArticlePreview from "./ArticlePreview";
import { Touch } from 'vuetify/lib/directives'

import wikipage from '../wiki/page'
import { mapGetters, mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "ArticleContent",
  directives:{
    touch:Touch
  },
  props: {
    article: {
      type: Object,
      default: () => null
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TableOfContents,
    Reference,
    ArticleHeader,
    ArticlePreview
  },
  data: () => ({
    error: null,
    activeToc: [],
    bannerImage: "",
    selectedReference: null,
    previewShown: false
  }),
  computed: {
    loaded: function() {
      return (
        this.article.loadingStatus === "success" ||
        this.article.loadingStatus === "failure"
      );
    },
    sections: function() {
      if (this.isPreview) {
        // Render only first few sections for preview
        return this.article.sections && this.article.sections.slice(0, 2);
      }
      return this.article.sections;
    },
    toc: function() {
      return this.article.toc;
    },
    displaytitle: function() {
      return this.article.title;
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
    preview: function() {
      return this.article.preview;
    },
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    })
  },
  watch: {
    loaded: function() {
      this.previewShown = false;
      if (!this.isPreview) {
        setTimeout(() => this.listen(), 1000);
      }
    }
  },
  methods: {
    layout(section) {
      return wikipage.layout(section,this.contentLanguage)
    },
    listen() {
      const links = document.querySelectorAll("section a[title]");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener("click", event => this.wikilinkClickHandler(link, event));
        if (this.$vuetify.breakpoint.mdAndUp){
          link.addEventListener("mouseover", event => this.wikilinkHoverHandler(link, event) );
        }
        link.addEventListener("mouseout", event => {
          this.previewShown = false;
        });
      }

      const references = document.querySelectorAll("section a[href^='#cite']");
      for (let i = 0; i < references.length; i++) {
        references[i].addEventListener("click", event => this.referenceClickHandler(references[i], event));
      }
    },

    wikilinkHoverHandler(link, event) {
      if (wikipage.isIgnorableLinkClick(event)) return;
      // don't handle same page links/anchors
      const url = new URL(link.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        setTimeout(() => {
          if (link.matches(':hover')) {
            // Still hovered.
             this.$store.dispatch("article/preview", {
              title: link.title,
              language: this.contentLanguage
            });
            this.previewShown = true;
          }
        }, 500);
      }
    },
    wikilinkClickHandler(link, event) {
      this.previewShown = false;
      if (wikipage.isIgnorableLinkClick(event)) return;
      link.removeEventListener("mouseover", this.wikilinkHoverHandler );

      // don't handle same page links/anchors
      const url = new URL(link.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        window.scrollTo(0, 0);
        this.$router.push(
          `/page/${this.$store.state.app.contentLanguage}/${link.title}`
        );
      }
    },
    referenceClickHandler(referenceLink, event) {
      this.selectedReference = null;
      const referenceId = new URL(referenceLink.href).hash;

      if (referenceId && event.preventDefault) {
        event.preventDefault();
        const refTarget = document.querySelector(referenceId);
        this.selectedReference = refTarget.innerHTML;
      }
    },
    swipe(direction) {
      if (direction === "Left") {
        this.$router.go(1);
      }
      if (direction === "Right") {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less">
@import url('../assets/page.less');
</style>