import articleApi from '../../wiki/api/article'
import historyApi from '../../wiki/api/history'

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
    revisions:[],
    history: {},
    metadata:{},
    media:{},
    geo:{},
    pronunciation:{},
    loadingStatus: 'loading',
};

// The only way to actually change state in a Vuex store is by committing a mutation.
const mutations = {
    setLoadingStatus(state, status) { state.loadingStatus = status },
    setTitle(state, title) {
        state.title = title
    },
    setDescription(state, description) { state.description = description },
    setImage(state, image) { state.image = image },
    setIssues(state, issues) { state.issues = issues },
    setLanguagecount(state, languagecount) { state.languagecount = languagecount },
    setWikidataId(state, id) { state.wikidataId = id },
    setSections(state, sections) { state.sections = sections },
    setTOC(state, toc) { state.toc = toc },
    setHistory(state, history) { state.history = history },
    setRevisions(state, revisions) { state.revisions = revisions },
    setMetadata(state, metadata) { state.metadata = metadata },
    setMedia(state, mediaInfo) { state.media = mediaInfo },
    setGeo(state, geo) { state.geo = geo },
    setPronunciation(state, pronunciation) { state.pronunciation = pronunciation },
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
                commit('setGeo', articleData.geo)
                commit('setLoadingStatus', 'success')
                commit('setPronunciation', articleData.pronunciation)
                dispatch('metadata', articleRequest);
                dispatch('media', articleRequest);
                dispatch('history', articleRequest);
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
    history({ commit, state }, articleRequest) {
        historyApi.fetchHistory(articleRequest.language, state.title)
        .then(revisions=>{
            commit('setRevisions', revisions)
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