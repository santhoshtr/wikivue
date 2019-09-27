<template>
  <div class="editor">
    <v-container
      fluid
      class="pa-0"
    >
      <v-tabs
        class="elevation-1"
        grow
      >
        <v-tabs-slider />

        <v-tab :href="`#tab-editor`">
          <v-icon>mdi-pencil</v-icon>
        </v-tab>
        <v-tab :href="`#tab-html`">
          <v-icon>mdi-code-tags</v-icon>
        </v-tab>
        <v-tab :href="`#tab-wikitext`">
          <v-icon>mdi-code-braces</v-icon>
        </v-tab>
        <v-tab-item :value="'tab-editor'">
          <editor-menu-bar
            :editor="editor"
            v-slot="{ commands, isActive }"
          >
            <v-toolbar
              dense
              flat
              elevation="1"
            >
              <v-btn-toggle>
                <v-btn
                  text
                  @click="commands.undo"
                >
                  <v-icon>mdi-undo</v-icon>
                </v-btn>

                <v-btn
                  text
                  @click="commands.redo"
                >
                  <v-icon>mdi-redo</v-icon>
                </v-btn>
              </v-btn-toggle>
              <v-divider vertical />

              <v-btn-toggle multiple>
                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.bold() }"
                  @click="commands.bold"
                >
                  <v-icon>mdi-format-bold</v-icon>
                </v-btn>
                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.italic() }"
                  @click="commands.italic"
                >
                  <v-icon>mdi-format-italic</v-icon>
                </v-btn>

                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.underline() }"
                  @click="commands.underline"
                >
                  <v-icon>mdi-format-underline</v-icon>
                </v-btn>
                <v-btn
                  text
                  @click="commands.link({href: selectedText})"
                >
                  <v-icon>mdi-link</v-icon>
                </v-btn>
              </v-btn-toggle>
              <v-menu
                :fixed="true"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-format-header-1</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-btn
                        text
                        :class="{ 'v-btn--active': isActive.heading({ level: 1 }) }"
                        @click="commands.heading({ level: 1 })"
                      >
                        <v-icon>mdi-format-header-1</v-icon>
                      </v-btn>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-btn
                        text
                        :class="{ 'v-btn--active': isActive.heading({ level: 2 }) }"
                        @click="commands.heading({ level: 2 })"
                      >
                        <v-icon>mdi-format-header-2</v-icon>
                      </v-btn>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-btn
                        text
                        :class="{ 'v-btn--active': isActive.heading({ level: 3 }) }"
                        @click="commands.heading({ level: 3 })"
                      >
                        <v-icon>mdi-format-header-3</v-icon>
                      </v-btn>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-btn
                        text
                        :class="{ 'v-btn--active': isActive.heading({ level: 4 }) }"
                        @click="commands.heading({ level: 4 })"
                      >
                        <v-icon>mdi-format-header-4</v-icon>
                      </v-btn>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-btn
                        text
                        :class="{ 'v-btn--active': isActive.heading({ level: 5 }) }"
                        @click="commands.heading({ level: 5 })"
                      >
                        <v-icon>mdi-format-header-5</v-icon>
                      </v-btn>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-btn-toggle>
                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>

                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.ordered_list() }"
                  @click="commands.ordered_list"
                >
                  <v-icon>mdi-format-list-numbered</v-icon>
                </v-btn>
                <v-divider vertical />
                <v-menu
                  :fixed="true"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="hidden-xs-only"
                      text
                      v-on="on"
                    >
                      <v-icon>mdi-table</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-btn
                      class="hidden-xs-only"
                      text
                      @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                    >
                      <v-icon>mdi-table-plus</v-icon>
                    </v-btn>
                    <span v-if="isActive.table()">
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.addRowBefore"
                      >
                        <v-icon>mdi-table-row-plus-before</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.addRowAfter"
                      >
                        <v-icon>mdi-table-row-plus-after</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.deleteRow"
                      >
                        <v-icon>mdi-table-row-remove</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.addColumnBefore"
                      >
                        <v-icon>mdi-table-column-plus-after</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.addColumnBefore"
                      >
                        <v-icon>mdi-table-column-plus-before</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.deleteColumn"
                      >
                        <v-icon>mdi-table-column-remove</v-icon>
                      </v-btn>
                      <v-divider />
                      <!-- <v-subheader>Actions</v-subheader> -->
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.toggleCellMerge"
                      >
                        <v-icon>mdi-table-merge-cells</v-icon>
                      </v-btn>
                      <v-btn
                        class="hidden-xs-only"
                        text
                        @click="commands.deleteTable"
                      >
                        <v-icon>mdi-table-remove</v-icon>
                      </v-btn>
                    </span>
                  </v-list>
                </v-menu>
                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.blockquote() }"
                  @click="commands.blockquote"
                >
                  <v-icon>mdi-format-quote-open</v-icon>
                </v-btn>

                <v-btn
                  text
                  :class="{ 'v-btn--active': isActive.code_block() }"
                  @click="commands.code_block"
                >
                  <v-icon>mdi-code-tags</v-icon>
                </v-btn>

                <v-btn
                  text
                  @click="commands.horizontal_rule"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-toolbar>
          </editor-menu-bar>
          <editor-menu-bubble
            :editor="editor"
            v-slot="{ commands, isActive, getMarkAttrs, menu }"
          >
            <v-form
              class="contexttool"
              :class="{ 'is-active': isActive.link() }"
              @submit.prevent="setLinkUrl(commands.link, linkUrl)"
            >
              <v-toolbar
                dense
                flat
              >
                <v-icon>mdi-link</v-icon>
                <v-text-field
                  solo
                  flat
                  filled
                  placeholder="Title"
                  hide-details
                  :value="getMarkAttrs('link').href"
                />

                <v-btn
                  icon
                  @click="commands.link({})"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  icon
                  :href="getMarkAttrs('link').href"
                  target="_blank"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </v-toolbar>
            </v-form>
          </editor-menu-bubble>
          <editor-content
            class="editor__content"
            :editor="editor"
          />
        </v-tab-item>
        <v-tab-item :value="'tab-html'">
          <v-card>
            <v-card-text>
              <pre><code>{{ html }}</code></pre>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-wikitext'">
          <v-card>
            <v-card-text>
              <pre><code>{{ wikitext }}</code></pre>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <v-row>
        <v-col
          cols="12"
          sm="12"
          class="editor px-4"
        />
      </v-row>
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
            this is a <b>very</b> <i>basic</i> example of tiptap.
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
    },
    selectedText: function() {
      const { selection, state } = this.editor;
      const { from, to } = selection;
      return state.doc.textBetween(from, to, " ");
    }
  },
  methods: {
    onEditorInit() {
      // Editor init handler
    },
    onEditorUpdate({ getHTML }) {
      this.html = getHTML();
      debounce(this.html2wikitext, 2000)(this.html);
    },
    html2wikitext(html) {
      const api = `https://${this.contentLanguage}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`;
      axios.post(api, { html, scrub_wikitext: true }).then(response => {
        this.wikitext = response.data;
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
    }
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
    z-index: 20;
    display: none;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      align-items: center;
      display: block;
      position: absolute;
      opacity: 1;
      box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
    }
  }
  .editor__content {
    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid grey;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
</style>
