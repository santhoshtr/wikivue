<template>
  <article
    :lang="contentLanguage"
    :dir="contentLanguageDir"
    ref="article"
    :style="$vuetify.breakpoint.smAndDown && 'overflow:hidden;'"
    tabindex="0"
  >
    <v-progress-linear
      :active="!loaded"
      :indeterminate="!loaded"
      color="blue"
      absolute
      top
    />
    <v-layout>
      <v-flex xs12>
        <article-header
          :article="article"
          :is-preview="isPreview"
          :quickfacts="quickfacts"
        />
        <div class="error" :if="error">
          {{ error }}
        </div>
      </v-flex>
    </v-layout>
    <v-layout fill-height>
      <v-flex xs2 sm2 md3 lg3 hidden-sm-and-down>
        <table-of-contents :toc="toc" />
      </v-flex>
      <v-flex xs12 sm12 md9 lg9>
        <v-sheet class="content px-3">
          <section
            v-for="section in sections"
            :key="`section-${section.id}`"
            :id="section.anchor"
            class="py-4 px-2 ma-0"
          >
            <a
              :href="`#${section.anchor}`"
              class="section-anchor text--primary"
            >
              <h2 v-if="section.toclevel === 1" v-html="section.heading" />
              <h3 v-else v-html="section.heading" />
            </a>
            <v-layout row fill-height class="pa-0 ma-0">
              <div class="flex md8 lg8 xs12 sm12" v-html="section.content" />
              <aside
                class="flex px-2 md4 lg4 hidden-sm-and-down section-aside"
                v-html="section.aside"
              />
            </v-layout>
          </section>
          <v-expansion-panels accordion class="mb-5">
            <v-expansion-panel
              v-for="(section, i) in collapsibleSections"
              :key="`section-collapsible-${i}`"
              :id="section.anchor"
            >
              <v-expansion-panel-header>
                <h2 v-if="section.toclevel === 1" v-html="section.heading" />
                <h3 v-else v-html="section.heading" />
              </v-expansion-panel-header>
              <v-expansion-panel-content v-html="section.content" />
            </v-expansion-panel>
          </v-expansion-panels>

          <v-divider />
          <template v-if="loaded">
            <article-footer :article="article" />
          </template>
        </v-sheet>
        <reference :reference="selectedReference" :if="selectedReference" />
        <image-viewer :if="selectedImage" :imgsrc="selectedImage" />
        <article-preview
          :preview="preview"
          :show="previewShown"
          @close="previewShown = !previewShown"
        />
      </v-flex>
    </v-layout>
  </article>
</template>

<script>
import TableOfContents from "./TOC";
import ArticleHeader from "./ArticleHeader";
import ArticleFooter from "./ArticleFooter";

import wikipage from "../wiki/page";
import { mapGetters, mapState } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "ArticleContent",
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
    Reference: () => import(/* webpackPrefetch: true */ "./Reference.vue"),
    ArticleHeader,
    ArticleFooter,
    ArticlePreview: () =>
      import(/* webpackPrefetch: true */ "./ArticlePreview.vue"),
    ImageViewer: () => import(/* webpackPrefetch: true */ "./ImageViewer.vue")
  },
  data: () => ({
    error: null,
    activeToc: [],
    bannerImage: "",
    selectedReference: null,
    selectedImage: null,
    sections: [],
    collapsibleSections: [],
    previewShown: false,
    quickfacts: null
  }),
  computed: {
    loaded: function() {
      return (
        this.article.loadingStatus === "success" ||
        this.article.loadingStatus === "failure"
      );
    },
    toc: function() {
      return this.article.toc;
    },
    displaytitle: function() {
      return this.article.title;
    },
    ...mapGetters("app", ["contentLanguageDir"]),
    ...mapState({
      contentLanguage: state => state.app.contentLanguage,
      articleLanguages: state => state.article.metadata.language_links,
      preview: state => state.preview
    })
  },
  watch: {
    loaded: function() {
      if (this.loaded) {
        this.layout();
        this.previewShown = false;
        this.selectedImage = null;
        if (!this.isPreview) {
          setTimeout(() => this.listen(), 1000);
          // Push the article to history
          this.$store.commit("app/pushToHistory", {
            title: this.article.title,
            language: this.contentLanguage,
            description: this.article.description
          });
        }
        this.$nextTick(() => {
          this.$refs.article.focus();
          this.$root.$emit("pageLoaded");
        });
      }
    },
    contentLanguage: function() {
      let titleInChangedLanguage = this.article.title;
      const articleInChangedLanguage = this.articleLanguages.find(
        item => item.lang === this.contentLanguage
      );
      if (articleInChangedLanguage) {
        titleInChangedLanguage = articleInChangedLanguage.titles.normalized;
      }
      this.$router.push(
        `/page/${this.contentLanguage}/${titleInChangedLanguage}`
      );
    }
  },
  methods: {
    layout() {
      this.sections = [];
      this.quickfacts = null;
      this.collapsibleSections = [];
      let sectionsCount;
      if (!this.article.sections) sectionsCount = 0;
      sectionsCount = this.article.sections.length;
      if (this.isPreview) {
        sectionsCount = Math.min(sectionsCount, 2);
      }
      let isCollapsing = false;
      for (let i = 0; i < sectionsCount; i++) {
        const section = this.article.sections[i];
        const parseResult = this.parse(section, isCollapsing);
        if (parseResult.infobox && !this.quickfacts) {
          this.quickfacts = {
            infobox: parseResult.infobox
          };
        }
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
          this.collapsibleSections.push(sectionLayout);
        } else {
          this.sections.push(sectionLayout);
        }
      }
    },
    parse(section, noAside) {
      return wikipage.parse(section.html, this.contentLanguage, noAside);
    },
    listen() {
      const links = document.querySelectorAll("section a[title]");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener("click", event =>
          this.wikilinkHoverHandler(link, event)
        );
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
        this.$store.dispatch("preview/fetch", {
          title: link.title,
          language: this.contentLanguage
        });
        this.previewShown = true;
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
        this.$router.push(`/page/${this.contentLanguage}/${link.title}`);
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
      if (event.preventDefault) {
        event.preventDefault();
        this.selectedImage = new URL(imageLink.href).pathname.split("/").pop();
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
  overflow: hidden;
  &:hover {
    overflow: auto;
  }
}

.section-aside {
  overflow: hidden;
}

.section-anchor:hover {
  text-decoration: none;
}
</style>
