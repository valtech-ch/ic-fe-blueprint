import Vue from 'vue'
import 'whatwg-fetch'
import App from '@/components/App.vue'
import router from '@/router'
import '../dist/allComponents'
import '../dist/allPages'
import '@directives'
import '@filters'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false
Vue.prototype.$feComponents = process.env.COMPONENTS_BASEPATH
Vue.prototype.$fePages = process.env.PAGES_BASEPATH

const graphQLSettings = document.querySelector('body').dataset
const graphQLOptions = {
  wsEndpoint: process.env.IC_VUE_APP_GRAPHQL_WS || graphQLSettings.graphqlWs || 'ws://localhost:4000/graphql',
  httpEndpoint: process.env.IC_VUE_APP_GRAPHQL_HTTP || graphQLSettings.graphqlHttp || 'http://localhost:4000/graphql'
}

new Vue({
  apolloProvider: createProvider(graphQLOptions),
  router,
  render: h => h(App)
}).$mount('#app')
  .$on('titleChanged', value => {
    document.title = value + ' - ic-blueprint'
  })
