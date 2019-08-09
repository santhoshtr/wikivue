<template>
  <v-container fluid>
    <v-progress-linear
      :active="!loaded"
      :indeterminate="!loaded"
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
        <TOC :toc="toc" />
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
        lg6
        class="px-2"
      >
        <article
          :lang="$store.state.app.contentLanguage"
          :if="loaded"
        >
          <ArticleHeader
            :title="displaytitle || title"
            :description="description"
            :lastmodifier="lastmodifier"
            :lastmodified="lastmodified"
          />
          <v-sheet class="content" />
          <section
            v-for="section in sections"
            :key="section.id"
            :id="section.anchor"
            v-html="template(section.html)"
            class="my-4"
          />
          <div
            class="error"
            :if="error"
          >
            {{ error }}
          </div>
        </article>
        <reference :reference="selectedReference" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TOC from "../components/TOC";
import ArticleHeader from "../components/ArtcleHeader";
import Reference from "../components/Reference";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "Article",
  components: {
    TOC,
    Reference,
    ArticleHeader
  },
  data: () => ({
    error: null,
    activeToc: [],
    bannerImage: "",
    selectedReference: null
  }),
  computed: {
    ...mapState({
      loaded: state =>
        state.article.loadingStatus === "success" ||
        state.article.loadingStatus === "failure",
      sections: state => state.article.sections,
      toc: state => state.article.toc,
      displaytitle: state => state.article.title,
      description: state => state.article.description,
      lastmodifier: state => state.article.history.lastmodifier,
      lastmodified: state => state.article.history.lastmodified,
      contentLanguage: state => state.app.contentLanguage
    }),
    title: function() {
      return this.$route.params.title || "";
    }
  },
  watch: {
    title: function() {
      this.loadArticle();
    },
    loaded: function() {
      setTimeout(() => this.listen(), 1000);
    }
  },
  mounted: function() {
    this.loadArticle();
  },
  methods: {
    loadArticle() {
      if (this.$route.meta.random) {
        this.$store.dispatch("article/fetch", {
          language: this.contentLanguage
        });
      } else {
        this.$store.dispatch("article/fetch", {
          title: this.title,
          language: this.contentLanguage
        });
      }
    },
    template(section) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = section;
      var links = wrapper.querySelectorAll("a[href]");
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
      return wrapper.innerHTML;
    },
    listen() {
      const links = document.querySelectorAll("section a:not([href*='://'])");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener("click", event => {
          const href=link.getAttribute("href")
          if(!href)return;
          if (href.startsWith('#cite')) {
            this.referenceClickHandler(link, event);
          } else if (link.matches("a:not([href*='://'])")) {
            this.wikilinkClickHandler(link, event);
          }
        });
        link.addEventListener("mouseover", event => {
          const href=link.getAttribute("href")
          if(!href)return;
          if (href.startsWith('#cite')) {
            this.referenceClickHandler(link, event);
          }
        });
        link.addEventListener("blur", event => {
          this.selectedReference = null;
        });
        link.addEventListener("mouseout", event => {
          this.selectedReference = null;
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

    wikilinkClickHandler(link, event) {
      if (this.isIgnorableLinkClick(event)) return;
      // don't handle same page links/anchors
      const url = new URL(link.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        document.documentElement.scrollTop = 0; //scroll to top
        this.$router.push(to);
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

<style>
article {
  font-family: "Libertinus Serif", "Gentium", Georgia, Cambria, "Times New Roman", Times, serif;
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