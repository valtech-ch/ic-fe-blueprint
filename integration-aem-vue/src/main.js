import Vue from 'vue'
// import 'whatwg-fetch'
import App from '@/components/App.vue'
import router from '@/router'
import '../dist/allComponents'
import '../dist/allPages'
// import '@directives'
// import vueConfig from '@plugins'
// import mixins from '@mixins'
// import '@filters'

Vue.config.productionTip = false
Vue.prototype.$feComponents = process.env.COMPONENTS_BASEPATH
Vue.prototype.$fePages = process.env.PAGES_BASEPATH

new Vue({
  // ...vueConfig,
  // mixins,
  router,
  render: h => h(App)
}).$mount('#app').$on('titleChanged', value => { document.title = value + ' - ic-blueprint' })
