export default class Article {
  constructor({
    description,
    languagecount = 1,
    original,
    namespace,
    pageid,
    language,
    languages = [],
    pageprops,
    pageviews,
    thumbnail,
    title,
    issues = [],
    lastmodifier,
    lastmodified,
    revision,
    revisions = [],
    geo,
    image,
    media,
    _sections = [],
    _alias // The title from this page redirected from, if any. See mw/api/page.js#fetchMetadata
  } = {}) {
    this.language = language;
    this.title = title;
    this.pageId = pageid;
    this.description = description;
    this.image = original;
    this.pageprops = pageprops;
    this.pageviews = pageviews;
    this.thumbnail = thumbnail;
    this.languagecount = languagecount;
    this.revision = revision;
    this.alias = _alias;
    this.image = image;
    this.media = media;
    this.namespace = namespace;
    this.geo = geo;
    this.languages = languages;
    this.issues = issues;
    this._sections = _sections;
    this.lastmodifier = lastmodifier;
    this.lastmodified = lastmodified;
    this.revisions = revisions;
  }

  get id() {
    return `${this.language}/${this.title}`;
  }

  get sections() {
    const sections = [];
    for (let i = 0; i < this._sections.length; i++) {
      const section = this._sections[i];
      if (section.text) {
        sections.push({
          id: section.id,
          toclevel: section.toclevel,
          anchor: this.escapeAnchor(section.anchor),
          heading: section.line,
          html: section.text
        });
        continue;
      }
    }
    return sections;
  }

  get history() {
    return {
      lastmodifier: this.lastmodifier,
      lastmodified: this.lastmodified,
      lastrevision: this.revision
    };
  }

  get toc() {
    const toc = [];
    for (let i = 0; i < this._sections.length; i++) {
      const section = this._sections[i];
      if (section.text) {
        continue;
      }
      if (section.toclevel === 1) {
        toc.push({
          id: this.escapeAnchor(section.anchor),
          name: section.line,
          children: []
        });
      } else if (section.toclevel === 2) {
        toc[toc.length - 1].children.push({
          id: this.escapeAnchor(section.anchor),
          name: section.line
        });
      }
    }
    return toc;
  }

  escapeAnchor(str) {
    return str ? encodeURIComponent(str) : null;
  }
}
