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
    history:{},
    loadingStatus: 'loading'
};

// The only way to actually change state in a Vuex store is by committing a mutation.
const mutations = {
    setLoadingStatus(state, status) { state.loadingStatus = status },
    setTitle(state, title) { state.title = title },
    setDescription(state, description) { state.description = description },
    setImage(state, image) { state.image = image },
    setIssues(state, issues) { state.issues = issues },
    setLanguagecount(state, languagecount) { state.languagecount = languagecount },
    setWikidataId(state, id) { state.wikidataId = id },
    setSections(state, sections) { state.sections = sections },
    setTOC(state, toc) { state.toc = toc },
    setHistory(state, history) { state.history = history },
}

// Computed properties for stores.
const getters = {}

const actions = {
    fetch({ commit, state }, articleRequest) {
        commit('setLoadingStatus', 'loading')
        articleApi.fetchArticle(articleRequest.language, articleRequest.title)
            .then((articleData) => {
                commit('setTitle', articleData.lead.title)
                commit('setDescription', articleData.lead.description)
                commit('setImage', articleData.lead.image)
                commit('setIssues', articleData.lead.issues)
                commit('setLanguagecount', articleData.lead.languagecount)
                commit('setWikidataId', articleData.lead.wikibase_item)
                commit('setHistory', {
                    lastmodifier: articleData.lead.lastmodifier,
                    lastmodified: articleData.lead.lastmodified,
                    lastrevision: articleData.lead.revision,
                })
                const sections = []
                const toc = []

                const articleSections = [
                    ...articleData.lead.sections,
                    ...articleData.remaining.sections
                ];
                for (let i = 0; i < articleSections.length; i++) {
                    const section = articleSections[i];
                    if (section.text) {
                        const heading = section.line
                            ? `<h${section.toclevel + 1}>${section.line}</h${section.toclevel + 1}>`
                            : ''
                        sections.push({
                            id: section.id,
                            anchor: section.anchor,
                            html: heading + section.text
                        });
                        continue;
                    }
                    if (section.toclevel === 1) {
                        toc.push({
                            id: section.anchor,
                            name: section.line,
                            children: []
                        });
                    } else if (section.toclevel === 2) {
                        toc[toc.length - 1].children.push({
                            id: section.anchor,
                            name: section.line
                        });
                    }
                }
                commit('setSections', sections)
                commit('setTOC', toc)
                commit('setLoadingStatus', 'success')
            }).catch(err => {
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