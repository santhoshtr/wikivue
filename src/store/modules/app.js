import languagedata from "@wikimedia/language-data";
import wikicodes from "../../wiki/wikipedia-codes.json";

const state = {
  uiLanguage: navigator.language || "en",
  contentLanguage: "en",
  theme: "light",
  articlesHistory: [],
  nearbyArticles: []
};

const mutations = {
  setTheme(state, theme) {
    state.theme = theme;
  },
  setUiLanguage(state, uiLanguage) {
    state.uiLanguage = uiLanguage;
  },
  setContentLanguage(state, contentLanguage) {
    state.contentLanguage = contentLanguage;
  },
  pushToHistory(state, article) {
    const found = state.articlesHistory.find(
      item => item.title === article.title && item.language === article.language
    );
    if (!found) {
      state.articlesHistory.push(article);
    }
    // Keep only 10 items max
    state.articlesHistory = state.articlesHistory.splice(0, 10);
  },
  setNearbyArticles(state, nearbyArticles) {
    state.nearbyArticles = nearbyArticles;
  }
};

const getters = {
  contentLanguages: () => {
    const languageMap = {};
    for (let i = 0; i < wikicodes.length; i++) {
      languageMap[wikicodes[i]] = languagedata.getAutonym(wikicodes[i]);
    }
    return languageMap;
  },
  contentLanguageDir: state => {
    return languagedata.getDir(state.contentLanguage);
  },
  uiLanguageDir: state => {
    return languagedata.getDir(state.uiLanguage);
  }
};

const actions = {
  fetchNearbyArticles() {
    // Implement
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
