import Vue from 'vue'
import Router from 'vue-router'
import wikicodes from '../wiki/wikipedia-codes.json'

const routerOptions = [
  { path: '/', name: 'home', component: 'Home', params: true },
  { path: '/about', name: 'about', component: 'About', params: true },
  { path: '/page/random', name: 'random', component: 'Article', meta: { random: true } },
  { path: '/edit', name: 'edit', component: 'Edit', params: true },
  { path: '*', name: '404', component: '404', params: true }
]

for (let i = 0; i < wikicodes.length; i++) {
  routerOptions.push(
    { path: `/page/${wikicodes[i]}/:title`, component: 'Article', meta: { language: wikicodes[i] }, props: { language: wikicodes[i] } }
  )
}

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  routes,
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash, offset: { y: 80 } };
    }
    return new Promise((resolve) => {
      this.app.$root.$once('pageLoaded', () => {
        resolve(savedPosition || { x: 0, y: 0 })
      })
    })
  }
})