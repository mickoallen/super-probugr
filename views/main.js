import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import './stylus/main.styl'

Vue.use(Vuetify, {
  theme: {
      primary: '#1B2A42', //Main color
      primaryText: '#C7D6E9', //Color for text on primary
      secondary: '#4A4A4A', //Color for active nav
      lightText: '#87D1FF'
  }
})

//Create the App with the router
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
