<template>
  <div class="editor">
    <editor-menu-bar
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <v-toolbar
        dense
        dark
      >
        <v-btn-toggle>
          <v-btn
            text
            @click="commands.undo"
          >
            <v-icon>undo</v-icon>
          </v-btn>

          <v-btn
            text
            @click="commands.redo"
          >
            <v-icon>redo</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-divider vertical />

        <v-btn-toggle multiple>
          <v-btn
            text
            :depressed="isActive.bold()"
            @click="commands.bold"
          >
            <v-icon>format_bold</v-icon>
          </v-btn>
          <v-btn
            text
            :class="{ 'v-btn--active': isActive.italic() }"
            @click="commands.italic"
          >
            <v-icon>format_italic</v-icon>
          </v-btn>

          <v-btn
            text
            @click="commands.underline"
          >
            <v-icon>format_underline</v-icon>
          </v-btn>
          <v-btn
            text
            @click="commands.link({href:'#'})"
          >
            <v-icon>link</v-icon>
          </v-btn>
        </v-btn-toggle>

        <v-btn-toggle multiple>
          <v-btn
            text
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </v-btn>

          <v-btn
            text
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </v-btn>

          <v-btn
            text
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </v-btn>
          <v-divider vertical />

          <v-btn
            text
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>

          <v-btn
            text
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <v-icon>format_list_numbered</v-icon>
          </v-btn>
          <v-divider vertical />

          <v-btn
            text
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <v-icon>format_quote</v-icon>
          </v-btn>

          <v-btn
            text
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <v-icon>code</v-icon>
          </v-btn>

          <v-btn
            text
            @click="commands.horizontal_rule"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </editor-menu-bar>
    <v-container
      fluid
      class="pa-0"
    >
      <v-row>
        <v-col
          cols="12"
          sm="12"
          class="editor px-4"
        >
          <editor-menu-bubble
            :editor="editor"
            v-slot="{ commands, isActive, getMarkAttrs, menu }"
          >
            <v-card
              class="contexttool"
              :class="{ 'is-active': isActive.link() }"
            >
              <v-form @submit.prevent="setLinkUrl(commands.link, linkUrl)">
                <v-toolbar
                  dense
                  flat
                  dark
                >
                  <v-text-field
                    solo
                    flat
                    filled
                    single-line
                    placeholder="Title"
                    hide-details
                    v-model="linkUrl"
                    :value="getMarkAttrs('link').href"
                  />

                  <v-btn
                    text
                    @click="commands.link({})"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <v-btn
                    text
                    :href="getMarkAttrs('link').href"
                    target="_blank"
                  >
                    <v-icon>link</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-form>
            </v-card>
          </editor-menu-bubble>
          <editor-content
            class="editor__content"
            :editor="editor"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container
      fluid
      class="pa-0"
    >
      <v-card>
        <v-card-title class="py-1">
          HTML
        </v-card-title>
        <v-card-text>
          <pre><code>{{ html }}</code></pre>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title class="py-1">
          Wikitext
        </v-card-title>
        <v-card-text>
          <pre><code>{{ wikitext }}</code></pre>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import axios from "axios";
import debounce from "debounce";
import {
  EditorContent,
  EditorMenuBar,
  EditorMenuBubble,
  WikiEditor
} from "../plugins/editor";

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  data() {
    return {
      toggle_exclusive: 2,
      toggle_multiple: [],
      html: "Update content to see changes",
      wikitext: "Update the content to see changes",
      linkUrl: null,
      content: `
          <h2>
            Title
          </h2>
          <p>
            this is a very <em>basic</em> example of tiptap.
          </p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>
              A regular list
            </li>
            <li>
              With regular items
            </li>
          </ul>
          <blockquote>
            It's amazing 👏
            <br />
            – somebody
          </blockquote>
          <p>Some <a href="target">link</a></p>
           <table>
              <tr>
                <th colspan="3" data-colwidth="100,0,0">Wide header</th>
              </tr>
              <tr>
                <td>One</td>
                <td>Two</td>
                <td>Three</td>
              </tr>
              <tr>
                <td>Four</td>
                <td>Five</td>
                <td>Six</td>
              </tr>
            </table>
        `
    };
  },
  computed: {
    ...mapState({
      contentLanguage: state => state.app.contentLanguage
    }),
    editor: function() {
      return new WikiEditor({
        content: this.content,
        onInit: this.onEditorInit,
        onUpdate: this.onEditorUpdate
      });
    }
  },
  methods: {
    onEditorInit() {
      // Editor init handler
    },
    onEditorUpdate({ getHTML }) {
      this.html = getHTML();
      debounce(this.html2wikitext, 1000)(this.html);
    },
    html2wikitext(html) {
      const api = `https://${this.contentLanguage}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`;
      axios.post(api, { html, scrub_wikitext: true }).then(response => {
        this.wikitext = response.data;
      });
    },
    hideLinkMenu() {
      this.linkUrl = null
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="less">
.editor {
  position: relative;
  .contexttool {
    position: relative;
    top: 0;
    display: flex;
    z-index: 20;
    visibility: hidden;
    opacity: 0;
    // transform: translateX(-50%);
    align-items: center;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
