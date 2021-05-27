import axios from "axios";

function fetchFeed(language) {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = ("0" + (today.getUTCMonth() + 1)).slice(-2);
  const date = ("0" + today.getUTCDate()).slice(-2);

  const api = `https://${language}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
  return axios.get(api).then(response => response.data);
}

function wikiSearch(language, query) {
  const titleQuery = query.trim();
  const api = `https://${language}.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch=${titleQuery}&prop=pageimages|description&piprop=thumbnail&pithumbsize=50&pilimit=10&format=json&formatversion=2&origin=*`;

  return axios
    .get(api)
    .then(response => response.data.query.pages)
    .then(pages => pages.sort((page1, page2) => page1.index - page2.index));
}

function html2wikitext(language, html) {
  const api = `https://${language}.wikipedia.org/api/rest_v1/transform/html/to/wikitext`;
  return axios
    .post(api, { html, scrub_wikitext: true })
    .then(response => response.data);
}

export default {
  fetchFeed,
  wikiSearch,
  html2wikitext
};
