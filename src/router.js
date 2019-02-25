import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
