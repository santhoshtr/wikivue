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
    metadata:{},
    media:{},
    loadingStatus: 'loading',
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
    setMetadata(state, metadata) { state.metadata = metadata },
    setMedia(state, mediaInfo) { state.media = mediaInfo },
}

// Computed properties for stores.
const getters = {}

const actions = {
    fetch({ commit, state , dispatch}, articleRequest) {
        commit('setLoadingStatus', 'loading')
        commit('setTitle', articleRequest.title)
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
                dispatch('metadata', articleRequest);
                dispatch('media', articleRequest);
            }).catch(err => {
                console.error(err);
                commit('setLoadingStatus', 'failure')
            })
    },
    metadata({ commit, state }, articleRequest) {
        articleApi.fetchMetadata(articleRequest.language, articleRequest.title)
        .then(metadata=>{
            commit('setMetadata', metadata)
        })
    },
    media({ commit, state }, articleRequest) {
        articleApi.fetchMedia(articleRequest.language, articleRequest.title)
        .then(mediaInfo=>{
            commit('setMedia', mediaInfo)
        })
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}