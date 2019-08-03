import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import i18n from 'vue-banana-i18n'

Vue.config.productionTip = false

Vue.use(i18n, {
  locale: navigator.language || 'en',
  messages: { }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
