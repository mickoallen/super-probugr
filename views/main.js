import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import './stylus/main.styl'

Vue.use(Vuetify, {
  theme: {
      primary: '#7A858D', //Main color
      primaryText: '#241F1C', //Color for text on primary
      secondary: '#66747D', //Color for active nav
      lightText: '#F2F2F5',
      accent: '#87B2CB'
  }
})

//Create the App with the router
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
