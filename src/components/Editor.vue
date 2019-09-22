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
                sm="2"
                class="py-0"
              >
                <v-btn-toggle
                  v-model="toggle_multiple"
                  multiple
                >
                  <v-btn
                    text
                    @click="commands.bold"
                  >
                    <v-icon>format_bold</v-icon>
                  </v-btn>
                  <v-btn
                    text
                    :class="{ 'is-active': isActive.italic() }"
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
                </v-btn-toggle>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="py-0"
              >
                <v-btn-toggle
                  v-model="toggle_multiple"
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
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
        toggle_exclusive: 2,
        toggle_multiple: [],
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: `
          <h2>
            Hi there,
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
            – mom
          </blockquote>
        `,
      }),
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>