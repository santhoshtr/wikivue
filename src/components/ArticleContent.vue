<template>
  <v-container
    fluid
    class="my-0 py-0"
  >
    <v-progress-linear
      :active="!loaded"
      :indeterminate="!loaded"
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
      >
        <table-of-contents :toc="toc" />
      </v-flex>
      <v-flex
        xs12
        sm12
        md9
        lg9
      >
        <article
          :lang="contentLanguage"
          :dir="contentLanguageDir"
        >
          <article-header
            :article="article"
            :is-preview="isPreview"
          />
          <div
            class="
            error"
            :if="error"
          >
            {{ error }}
          </div>
          <v-sheet class="content">
            <section
              v-for="section in layout.sections"
              :key="section.id"
              :id="section.anchor"
              class="py-4 px-2 ma-0"
            >
              <h2
                v-if="section.toclevel===1"
                v-html="section.heading"
              />
              <h3
                v-else
                v-html="section.heading"
              />
              <v-layout
                row
                fill-height
                class="pa-0 ma-0"
              >
                <div
                  class="flex md8 lg8 xs12 sm12"
                  v-html="section.content"
                />
                <aside
                  class="flex px-2 md4 lg4 hidden-sm-and-down section-aside"
                  v-html="section.aside"
                />
              </v-layout>
            </section>
            <v-expansion-panels
              accordion
              class="mb-5"
            >
              <v-expansion-panel
                v-for="(section,i) in layout.collapsibleSections"
                :key="i"
                :id="section.anchor"
              >
                <v-expansion-panel-header>
                  <h2
                    v-if="section.toclevel===1"
                    v-html="section.heading"
                  />
                  <h3
                    v-else
                    v-html="section.heading"
                  />
                </v-expansion-panel-header>
                <v-expansion-panel-content v-html="section.content" />
              </v-expansion-panel>
            </v-expansion-panels>

            <v-divider />
            <template v-if="loaded">
              <article-footer :article="article" />
            </template>
          </v-sheet>
          <reference
            :reference="selectedReference"
            :if="selectedReference"
          />
          <image-viewer
            :if="selectedImage"
            :imgsrc="selectedImage"
          />
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
import ArticleHeader from "./ArticleHeader";
import ArticleFooter from "./ArticleFooter";
import { Touch } from "vuetify/lib/directives";

import wikipage from "../wiki/page";
import { mapGetters, mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "ArticleContent",
  directives: {
    touch: Touch
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
    Reference:() => import(/* webpackPrefetch: true */ './Reference.vue'),
    ArticleHeader,
    ArticleFooter,
    ArticlePreview:() => import(/* webpackPrefetch: true */ './ArticlePreview.vue'),
    ImageViewer:() => import(/* webpackPrefetch: true */ './ImageViewer.vue'),
  },
  data: () => ({
    error: null,
    activeToc: [],
    bannerImage: "",
    selectedReference: null,
    selectedImage:null,
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
    layout: function() {
      const sections = [];
      const collapsibleSections = [];
      if (!this.article.sections) return [];
      let isCollapsing = false;
      let sectionsCount = this.article.sections.length;
      if (this.isPreview) {
        // Render only first few sections for preview
        sectionsCount=Math.min(sectionsCount,2);
      }
      for (let i = 0; i < sectionsCount; i++) {
        const section = this.article.sections[i];
        const parseResult = this.parse(section, isCollapsing);
        const sectionLayout = {
          id: section.id,
          anchor: section.anchor,
          heading: section.heading,
          toclevel: section.toclevel,
          aside: parseResult.aside,
          content: parseResult.content
        };

        if (
          sectionsCount > 10 &&
          i >= sectionsCount - 3 &&
          section.toclevel === 1
        ) {
          isCollapsing = true;
        }
        if (isCollapsing) {
          collapsibleSections.push(sectionLayout);
        } else {
          sections.push(sectionLayout);
        }
      }
      return {
        sections,
        collapsibleSections
      };
    },
     ...mapGetters('app',[
      'contentLanguageDir'
    ]),
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      preview: state => state.preview,
    })
  },
  watch: {
    loaded: function() {
      if(this.loaded){
        this.previewShown = false;
        if (!this.isPreview) {
          setTimeout(() => this.listen(), 1000);
          window.document.title = this.article.title
          // Push the article to history
          this.$store.commit("app/pushToHistory", {
            title: this.article.title,
            language: this.contentLanguage,
            description: this.article.description,
          });
        }
      }
    }
  },
  methods: {
    parse(section, noAside) {
      return wikipage.parse(section.html, this.contentLanguage, noAside);
    },
    listen() {
      const links = document.querySelectorAll("section a[title]");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener("click", event =>
          this.wikilinkClickHandler(link, event)
        );
        if (this.$vuetify.breakpoint.mdAndUp) {
          link.addEventListener("mouseover", event =>
            this.wikilinkHoverHandler(link, event)
          );
        }
        link.addEventListener("mouseout", event => {
          this.previewShown = false;
        });
      }

      const references = document.querySelectorAll("section a[href^='#cite']");
      for (let i = 0; i < references.length; i++) {
        references[i].addEventListener("click", event =>
          this.referenceClickHandler(references[i], event)
        );
      }

      const images = document.querySelectorAll("section a[class='image']");
      for (let i = 0; i < images.length; i++) {
        images[i].addEventListener("click", event =>
          this.imageClickHandler(images[i], event)
        );
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
          if (link.matches(":hover")) {
            // Still hovered.
            this.$store.dispatch("preview/fetch", {
              title: link.title,
              language: this.contentLanguage
            });
            this.previewShown = true;
          }
        }, 1000);
      }
    },
    wikilinkClickHandler(link, event) {
      this.previewShown = false;
      if (wikipage.isIgnorableLinkClick(event)) return;
      link.removeEventListener("mouseover", this.wikilinkHoverHandler);

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
    imageClickHandler(imageLink, event) {
      this.selectedReference = null;
      if ( event.preventDefault) {
        event.preventDefault();
        this.selectedImage =  new URL(imageLink.href).pathname.split('/').pop();
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
@import url("../assets/page.less");

.table-wrapper {
  max-height: 80vh;
  padding: 5px 0;
  overflow: auto;
}
.section-aside {
  overflow:hidden;
}
</style>