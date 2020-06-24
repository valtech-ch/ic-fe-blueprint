import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      component: () => import('@/components/Overview')
    },
    {
      path: '/pages/:page',
      component: () => import('@/components/ComponentDemo')
    },
    {
      path: '/:type',
      component: () => import('@/components/Overview')
    },
    {
      path: '/:type/:view',
      redirect: to => {
        return to.fullPath + '/view/default'
      }
    },
    {
      name: 'component-detail',
      path: '/:type/:view/:tab/:model',
      component: () => import('@/components/ComponentView')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
