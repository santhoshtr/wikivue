import articleApi from "../../wiki/api/article";

const state = {
  articles: []
};

const mutations = {
  addArticle(state, article) {
    state.articles.push(article);
  }
};

// Computed properties for stores.
const getters = {
  getArticle: state => (language, title) =>
    state.articles.find(
      page =>
        page.language === language &&
        (page.title === title || page.alias === title)
    )
};

const actions = {
  async fetchArticle({ commit }, { language, title }) {
    const article = await articleApi.fetchArticle(language, title);
    commit("addArticle", article);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
