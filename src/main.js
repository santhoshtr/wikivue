import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import i18n from 'vue-banana-i18n'

Vue.config.productionTip = false

const locale = navigator.language.split('-')[0] || 'en'
const finalFallback = 'en'
const messages = {
  [finalFallback]: require(`@/assets/i18n/${finalFallback}.json`),
}

try {
  messages[locale] = require(`@/assets/i18n/${locale}.json`)
} catch {
  // Not localised. We have loaded fallback locale.
}

Vue.use(i18n, {
  locale,
  finalFallback: 'en',
  messages
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect
      delete sessionStorage.redirect
      this.$router.push(redirect)
    }
    this.$store.commit('app/setUiLanguage', locale)
  }
}).$mount('#app')
