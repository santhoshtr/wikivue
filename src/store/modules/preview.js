import articleApi from '../../wiki/api/article'

const state = {
    title: null,
    language: null,
    description: null,
    sections: [],
    toc: [],
    image: {},
    history:{},
    preview: {},
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
    setSections(state, sections) { state.sections = sections },
    setHistory(state, history) { state.history = history },
    setTOC(state, toc) { state.toc = toc },
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
                commit('setSections', articleData.sections)
                commit('setHistory', articleData.history)
                commit('setTOC', articleData.toc)
                commit('setLoadingStatus', 'success')
            }).catch(err => {
                console.error(err);
                commit('setLoadingStatus', 'failure')
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