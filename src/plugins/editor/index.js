import { EditorContent, EditorMenuBar, EditorMenuBubble, Editor } from "tiptap";

import Blockquote from "./nodes/Blockquote";
import BulletList from "./nodes/BulletList";
import CodeBlock from "./nodes/CodeBlock";
import HardBreak from "./nodes/HardBreak";
import Heading from "./nodes/Heading";
import HorizontalRule from "./nodes/HorizontalRule";
import Image from "./nodes/Image";
import ListItem from "./nodes/ListItem";
import OrderedList from "./nodes/OrderedList";
import Table from "./nodes/Table";
import TableHeader from "./nodes/TableHeader";
import TableCell from "./nodes/TableCell";
import TableRow from "./nodes/TableRow";

import Bold from "./marks/Bold";
import Code from "./marks/Code";
import Italic from "./marks/Italic";
import WikiLink from "./marks/WikiLink";
import Link from "./marks/Link";
import Strike from "./marks/Strike";
import Underline from "./marks/Underline";

import History from "./extensions/History";

import axios from "axios";
class WikiEditor extends Editor {
  constructor(options) {
    const defaultOptions = {
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new WikiLink(),
        new Link(),
        new Image(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Table({
          resizable: true
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow()
      ]
    };
    super(Object.assign(options, defaultOptions));
  }
  html2wikitext(html) {
    const api = `https://${this.contentLanguage}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`;
    return axios
      .post(api, { html, scrub_wikitext: true })
      .then(response => response.data);
  }
}

export { EditorContent, EditorMenuBar, EditorMenuBubble, WikiEditor };
