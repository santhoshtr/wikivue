
import languagedata from "@wikimedia/language-data";
import wikicodes from "../../wiki/wikipedia-codes.json";
import axios from 'axios';

const state = {
    uiLanguage: navigator.language || 'en',
    contentLanguage: 'en',
    theme: 'light',
    articlesHistory:[],
    nearbyArticles:[]
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
    pushToHistory(state, article){
        // TODO: filter and remove duplicates
        // Cap the max size of history
        state.articlesHistory.push(article);
    },
    setNearbyArticles(state, nearbyArticles){
        state.nearbyArticles=nearbyArticles;
    }
}

const getters = {
    contentLanguages: (state, getters, rootState) => {
        const languageMap = {}
        for (let i = 0; i < wikicodes.length; i++) {
            languageMap[wikicodes[i]] = languagedata.getAutonym(wikicodes[i]);
        }
        return languageMap;
    },
    contentLanguageDir: (state, getters, rootState) => {
        return languagedata.getDir(state.contentLanguage);
    },
    uiLanguageDir: (state, getters, rootState) => {
        return languagedata.getDir(state.uiLanguage);
    },
}

const actions = {
    fetchNearbyArticles({ commit, state }) {
        // Implement
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}