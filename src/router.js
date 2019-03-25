import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: () => import('./components/Overview.vue')
    },
    {
      path: '/:type/:component?',
      component: () => import('./components/Overview.vue')
    },
    {
      path: '/:type/:component/:view/:tab/:model',
      component: () => import('./components/ComponentView.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
