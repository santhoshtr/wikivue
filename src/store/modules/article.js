import articleApi from '../../wiki/api/article'

const state = {
    title: null,
    language: null,
    description: null,
    wikidataId: null,
    sections: [],
    toc: [],
    image: {},
    languagecount: 0,
    issues: [],
    history: {},
    preview: {},
    loadingStatus: 'loading',
    previewLoadingStatus: 'loading',
};

// The only way to actually change state in a Vuex store is by committing a mutation.
const mutations = {
    setLoadingStatus(state, status) { state.loadingStatus = status },
    setTitle(state, title) {
        state.title = title
        window.document.title = state.title
    },
    setDescription(state, description) { state.description = description },
    setImage(state, image) { state.image = image },
    setIssues(state, issues) { state.issues = issues },
    setLanguagecount(state, languagecount) { state.languagecount = languagecount },
    setWikidataId(state, id) { state.wikidataId = id },
    setSections(state, sections) { state.sections = sections },
    setTOC(state, toc) { state.toc = toc },
    setHistory(state, history) { state.history = history },
    setPreviewLoadingStatus(state, status) { state.previewLoadingStatus = status },
    setPreview(state, preview) { state.preview = preview },
}

// Computed properties for stores.
const getters = {}

const actions = {
    fetch({ commit, state }, articleRequest) {
        commit('setLoadingStatus', 'loading')
        articleApi.fetchArticle(articleRequest.language, articleRequest.title)
            .then((articleData) => {
                commit('setTitle', articleData.title)
                commit('setDescription', articleData.description)
                commit('setImage', articleData.image)
                commit('setIssues', articleData.issues)
                commit('setLanguagecount', articleData.languagecount)
                commit('setWikidataId', articleData.wikidataId)
                commit('setHistory', articleData.history)
                commit('setSections', articleData.sections)
                commit('setTOC', articleData.toc)
                commit('setLoadingStatus', 'success')
            }).catch(err => {
                commit('setLoadingStatus', 'failure')
            })
    },
    preview({ commit, state }, previewRequest) {
        commit('setPreviewLoadingStatus', 'loading')
        articleApi.fetchArticle(previewRequest.language, previewRequest.title)
            .then((articleData) => {
                commit('setPreview', articleData)
                commit('setPreviewLoadingStatus', 'success')
            }).catch(err => {
                commit('setPreviewLoadingStatus', 'failure')
            })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}