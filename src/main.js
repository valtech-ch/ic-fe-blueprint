import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'

Vue.use(Router)

Vue.config.productionTip = false

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/pages/:page',
      component: () => import('./ComponentDemo')
    },
    {
      path: '/:type/:component',
      component: () => import('./ComponentOverview')
    },
    {
      path: '/:type/:component/:view/:tab/:model',
      component: () => import('./ComponentView')
    }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
