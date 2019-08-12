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

import { mapGetters, mapState, mapMutations } from "vuex";
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
      return this.article.history && this.article.history.lastmodified;
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
      if (!this.isPreview) {
        setTimeout(() => this.listen(), 1000);
      }
    }
  },
  methods: {
    layout(section) {
      const wrapper = document.createElement("div");
      const contentEl = document.createElement("div");
      contentEl.className += "flex pa-2 md8 lg8 xs12 sm12";
      wrapper.appendChild(contentEl);
      contentEl.innerHTML = section;
      const aside = document.createElement("aside");
      aside.className += "flex px-4 my-4 md4 lg4 hidden-sm-and-down";
      wrapper.appendChild(aside);
      const links = wrapper.querySelectorAll("a[href]");
      for (let l = 0; l < links.length; l++) {
        let link = links[l];
        for (let i = 0; i < link.attributes.length; i++) {
          let attribute = link.attributes[i];
          if (attribute.name === "href") {
            link.setAttribute(
              attribute.name,
              attribute.value.replace(
                "/wiki/",
                `/page/${this.contentLanguage}/`
              )
            );
            continue;
          }
          link.setAttribute(attribute.name, attribute.value);
        }
      }

      const hatnotes = wrapper.querySelectorAll("div.hatnote");
      const amboxes = wrapper.querySelectorAll(".ambox");
      const infobox = wrapper.querySelectorAll(".infobox");
      const rightSideImages = wrapper.querySelectorAll(
        "figure.mw-halign-right"
      );
      const leftSideImages = wrapper.querySelectorAll("figure.mw-halign-left");
      const smallFigures = wrapper.querySelectorAll("figure.mw-default-size");
      const sideItems = [
        ...hatnotes,
        ...infobox,
        ...amboxes,
        ...rightSideImages,
        ...leftSideImages,
        ...smallFigures
      ];
      for (let i = 0; i < sideItems.length; i++) {
        aside.appendChild(sideItems[i].cloneNode(true));
        sideItems[i].className += " hidden-md-and-up";
        if (i === 5) break; // Don't add too many items to sidebar
      }

      return wrapper.innerHTML;
    },
    listen() {
      const links = document.querySelectorAll("section a:not([href*='://'])");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener("click", event => {
          const href = link.getAttribute("href");
          if (!href) return;
          if (href.startsWith("#cite")) {
            this.referenceClickHandler(link, event);
          } else if (link.matches("a:not([href*='://'])")) {
            this.wikilinkClickHandler(link, event);
          }
        });
        link.addEventListener("mouseover", event => {
          const href = link.getAttribute("href");
          if (!href) return;
          if (link.matches("a:not([href*='://'])")) {
            this.wikilinkHoverHandler(link, event);
          }
        });
        link.addEventListener("mouseout", event => {
          this.previewShown = false;
        });
      }
    },
    // Thanks to https://dennisreimann.de/articles/delegating-html-links-to-vue-router.html
    isIgnorableLinkClick(event) {
      // ensure we use the link, in case the click has been received by a subelement
      let { target } = event;
      // handle only links that occur inside the component and do not reference external resources
      if (!target) {
        return trrue;
      }
      // some sanity checks taken from vue-router:
      // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
      const {
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
        button,
        defaultPrevented
      } = event;
      // don't handle with control keys
      if (metaKey || altKey || ctrlKey || shiftKey) return true;
      // don't handle when preventDefault called
      if (defaultPrevented) return true;
      // don't handle right clicks
      if (button !== undefined && button !== 0) return true;
      // don't handle if `target="_blank"`
      if (target && target.getAttribute) {
        const linkTarget = target.getAttribute("target");
        if (/\b_blank\b/i.test(linkTarget)) return true;
      }
      if (!target.href) return true;
      return false;
    },

    wikilinkHoverHandler(link, event) {
      if (this.isIgnorableLinkClick(event)) return;
      // don't handle same page links/anchors
      const url = new URL(link.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        this.$store.dispatch("article/preview", {
          title: link.title,
          language: this.contentLanguage
        });
        setTimeout(() => {
          if (!this.previewShown) {
            this.previewShown = true;
          }
        }, 500);
      }
    },
    wikilinkClickHandler(link, event) {
      if (this.isIgnorableLinkClick(event)) return;
      // don't handle same page links/anchors
      const url = new URL(link.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        this.$router.push(
          `/page/${this.$store.state.app.contentLanguage}/${this.preview.title}`
        );
        this.previewShown = false;
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
    }
  }
};
</script>

<style lang="less">
article {
  font-family: "Libertinus Serif", "Gentium", Georgia, Cambria,
    "Times New Roman", Times, serif;

  display: flex;
  flex-flow: row wrap;
  section {
    flex: 1;
  }
  aside {
    flex: 1;
    > * {
      margin-bottom: 2em;
    }
    .hatnote,
    .ambox {
      color: #616161;
      padding: 0 5px;
      border-left: 1px solid #616161;
    }
  }
}

.mw-ref {
  vertical-align: super;
  line-height: 1;
  font-size: smaller;
  unicode-bidi: embed;
  font-weight: normal;
  font-style: normal;
}
a:hover,
a:focus {
  text-decoration: underline;
}
a {
  text-decoration: none;
  color: #0645ad;
  background: none;
}
.container {
  background-color: white;
}
p {
  line-height: 1.5;
  font-size: 18px;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
main,
menu,
nav,
section,
summary,
table.wikitable {
  display: block;
  overflow: auto;
}

figure {
  margin: 10px 0;
}
</style>