import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', name:'home', component: 'Home', params:true },
  { path: '/about', name:'about', component: 'About',params:true },
  { path: '*', name:'404', component: '404',params:true }
]

const languages=['en','ml']
for(let i=0;i<languages.length;i++){
  routerOptions.push(
    { path: `/${languages[i]}/:title`, component: 'Article', props: {language: languages[i]} }
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
  mode: "history"
})
