import { Mark, Plugin } from 'tiptap'
import { updateMark, removeMark, pasteRule } from 'tiptap-commands'
import { getMarkAttrs } from 'tiptap-utils'

export default class Link extends Mark {

  get name() {
    return 'wikilink'
  }

  get schema() {
    return {
      attrs: {
        href: {
          default: null,
        },
        title: {
          default: null,
        }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[rel="mw:WikiLink"]',
          getAttrs: dom => ({
            href: this.getLinkTarget(dom.getAttribute('title')),
            title: dom.getAttribute('title'),
          }),
        },
      ],
      toDOM: node => [
        'a',
        {
          ...node.attrs,
          rel: 'mw:WikiLink',
          href: this.getLinkTarget(node.attrs.title)
        },
        0
      ],
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.href || attrs.title) {
        return updateMark(type, attrs)
      }

      return removeMark(type)
    }
  }

  pasteRules({ type }) {
    return [
      pasteRule(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        type,
        url => ({ href: url }),
      ),
    ]
  }

  getLinkTarget(title){
    return `./${title}`
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const { schema } = view.state
            const attrs = getMarkAttrs(view.state, schema.marks.link)
            if (attrs.href && event.ctrlKey && event.target instanceof HTMLAnchorElement) {
              event.stopPropagation()
              window.open(attrs.href)
            }
          },
        },
      }),
    ]
  }

}
