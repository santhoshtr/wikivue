/* eslint-disable no-console */
import axios from "axios";
import Article from "../models/article";

function fetchMedia(language, title) {
  const api = `https://${language}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(
    title
  )}`;
  return axios.get(api).then(response => response.data);
}

function fetchLanguages(language, title) {
  const params = {
    action: "query",
    format: "json",
    formatversion: 2,
    prop: "langlinks",
    titles: title,
    lllimit: 500,
    origin: "*"
  };

  const api = `//${language}.wikipedia.org/w/api.php`;
  return axios.get(api, { params }).then(response => {
    return response.data.query.pages.length
      ? response.data.query.pages[0].langlinks
      : [];
  });
}
function fetchRevisions(language, title) {
  const params = {
    action: "query",
    format: "json",
    formatversion: 2,
    prop: "revisions",
    titles: title,
    rvprop: "ids|timestamp|comment|size|flags|user",
    rvlimit: 100,
    origin: "*"
  };

  const api = `//${language}.wikipedia.org/w/api.php`;
  return axios.get(api, { params }).then(response => {
    return response.data.query.pages.length
      ? response.data.query.pages[0].revisions
      : [];
  });
}

async function fetchArticle(language, title) {
  if (!language) {
    throw new Error("Language is null");
  }
  let api;
  if (title) {
    api = `https://${language}.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(
      title
    )}`;
  } else {
    api = `https://${language}.wikipedia.org/api/rest_v1/page/random/mobile-sections`;
  }
  const [articleData, revisions, media, languages] = await Promise.all([
    axios.get(api).then(response => response.data),
    fetchRevisions(language, title),
    fetchMedia(language, title),
    fetchLanguages(language, title)
  ]);

  return new Article({
    pageid: articleData.lead.id,
    namespace: articleData.lead.ns,
    title: articleData.lead.normalizedtitle,
    description: articleData.lead.description,
    image: articleData.lead.image,
    issues: articleData.lead.issues,
    geo: articleData.lead.geo,
    pronunciation: articleData.lead.pronunciation,
    languagecount: articleData.lead.languagecount,
    wikidataId: articleData.lead.wikibase_item,
    lastmodifier: articleData.lead.lastmodifier,
    lastmodified: articleData.lead.lastmodified,
    revision: articleData.lead.revision,
    language,
    revisions,
    languages,
    media: media.items,
    _sections: [...articleData.lead.sections, ...articleData.remaining.sections]
  });
}

export default { fetchArticle };
