import axios from "axios";

function fetchHistory(language, title) {
  const params = {
    action: "query",
    format: "json",
    formatversion: 2,
    prop: "revisions",
    titles: title,
    rvprop: "ids|timestamp|comment|size|flags|user",
    rvlimit: 50,
    origin: "*"
  };

  const api = `//${language}.wikipedia.org/w/api.php`;
  return axios.get(api, { params }).then(response => {
    return response.data.query.pages.length
      ? response.data.query.pages[0].revisions
      : [];
  });
}

export default { fetchHistory };
