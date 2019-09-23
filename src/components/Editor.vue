<template>
  <div class="editor">
    <v-card>
      <v-card-text class="py-1">
        <v-container
          fluid
          class="pa-0"
        >
          <editor-menu-bar
            :editor="editor"
            v-slot="{ commands, isActive }"
          >
            <v-row>
              <v-col
                cols="12"
                sm="2"
                class="py-0"
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
              </v-col>
              <v-col
                cols="12"
                sm="3"
                class="py-0"
              >
                <v-btn-toggle
                  multiple
                >
                  <v-btn
                    text
                    :class="{ 'v-btn--active': isActive.bold() }"
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
                    @click="showLinkPrompt(commands.link)"
                  >
                    <v-icon>link</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="py-0"
              >
                <v-btn-toggle
                  multiple
                >
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
              </v-col>
            </v-row>
          </editor-menu-bar>
        </v-container>
      </v-card-text>
    </v-card>
    <v-container
      fluid
      class="pa-0"
    >
      <v-row>
        <v-col
          cols="12"
          sm="12"
          class="pa-4"
        >
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
import { EditorContent, EditorMenuBar, WikiEditor } from "../plugins/editor";

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      toggle_exclusive: 2,
      toggle_multiple: [],
      html: "Update content to see changes",
      wikitext: "Update the content to see changes",
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
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="less">
@import url('../plugins/editor/assets/editor.less');
</style>