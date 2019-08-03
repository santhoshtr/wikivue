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
        class="ml-2"
      >
        <TOC :toc="toc" />
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
        lg6
      >
        <article :if="loaded">
          <ArticleHeader
            :title="title"
            :description="description"
            :image="bannerImage"
          />
          <v-sheet class="content" />
          <section
            v-for="section in sections"
            :key="section.id"
            :id="section.anchor"
            v-html="section.html"
            class="my-4"
          />
          <div
            class="error"
            :if="error"
          >
            {{ error }}
          </div>
        </article>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import TOC from "../components/TOC";
import ArticleHeader from "../components/ArtcleHeader";

export default {
  name: "Article",
  components: {
    TOC,
    ArticleHeader
  },
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  data: () => ({
    error: null,
    activeToc: [],
    loaded: false,
    sections: [],
    description: "",
    displaytitle: "",
    bannerImage:"",
    toc: []
  }),
  computed: {
    title: function() {
      return this.$route.params.title;
    }
  },
  watch: {
    title: function() {
      this.loadArticle();
    },
    language: function() {
      this.loadArticle();
    }
  },
  mounted: function() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      this.loaded = false;
      this.toc = [];
      this.sections = [];
      const articleData = await this.fetchArticle(this.language, this.title);
      const sections = [
        ...articleData.lead.sections,
        ...articleData.remaining.sections
      ];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.text) {
        const heading= section.line
                ?`<h${section.toclevel+1}>${section.line}</h${section.toclevel+1}>`
                 :''
          this.sections.push({
              id: section.id,
            anchor: section.anchor,
              html: heading + section.text
          });
          continue;
        }
        if (section.toclevel === 1) {
          this.toc.push({
            id: section.anchor,
            name: section.line,
            children: []
          });
        } else if (section.toclevel === 2) {
          this.toc[this.toc.length - 1].children.push({
            id: section.anchor,
            name: section.line
          });
        }
      }
      this.loaded = true;
      this.displaytitle = articleData.lead.displaytitle;
      this.description = articleData.lead.description;
      this.bannerImage= articleData.lead.image && articleData.lead.image.urls['1024'];
      this.error = null;
    },
    fetchArticle(language, title) {
      if (!title) {
        return;
      }
      const api = `//${language}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`;
      return axios
        .get(api, {
          origin: "*"
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          this.error = error;
          this.loaded = true;
        });
    }
  }
};
</script>

<style>
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

article, aside, details, figcaption, figure, footer, header, main, menu, nav, section, summary,table.wikitable {
    display: block;
    overflow: auto;
}

figure {
    margin: 10px 0;
}

</style>