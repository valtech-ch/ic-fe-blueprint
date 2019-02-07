import Vue from 'vue'
import App from './App.vue'

import './app.scss'

const vues = document.querySelectorAll(".test");
Array.prototype.forEach.call(vues, (el, index) => new Vue({
  el, 
  render: h => h(App)
}))