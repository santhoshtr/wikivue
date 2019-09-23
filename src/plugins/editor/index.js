import { EditorContent, EditorMenuBar, Editor } from 'tiptap'

import Blockquote from './nodes/Blockquote'
import BulletList from './nodes/BulletList'
import CodeBlock from './nodes/CodeBlock'
import HardBreak from './nodes/HardBreak'
import Heading from './nodes/Heading'
import HorizontalRule from './nodes/HorizontalRule'
import Image from './nodes/Image'
import ListItem from './nodes/ListItem'
import OrderedList from './nodes/OrderedList'
import Table from './nodes/Table'
import TableHeader from './nodes/TableHeader'
import TableCell from './nodes/TableCell'
import TableRow from './nodes/TableRow'

import Bold from './marks/Bold'
import Code from './marks/Code'
import Italic from './marks/Italic'
import Link from './marks/Link'
import Strike from './marks/Strike'
import Underline from './marks/Underline'

import History from './extensions/History'

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
                new Link(),
                new Image(),
                new Bold(),
                new Code(),
                new Italic(),
                new Strike(),
                new Underline(),
                new History(),
                new Table({
                    resizable: true,
                }),
                new TableHeader(),
                new TableCell(),
                new TableRow(),
            ],
        };
        super(Object.assign(options, defaultOptions))
    }
}

export { EditorContent, EditorMenuBar, WikiEditor };