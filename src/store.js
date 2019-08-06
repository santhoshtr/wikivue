import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uiLanguage: navigator.language|| 'en',
    contentLanguage: 'en',
    theme: 'light'
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    },
    setUiLanguage(state, uiLanguage) {
      state.uiLanguage = uiLanguage;
    },
    setContentLanguage(state, contentLanguage) {
      state.contentLanguage = contentLanguage;
    }
  },
  getters : {
    theme: state => state.theme,
    contentLanguage: state => state.contentLanguage,
    uiLanguage: state => state.uiLanguage,
  },
  actions: {

  }
})
