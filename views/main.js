import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import './stylus/main.styl'

Vue.use(Vuetify, {
  theme: {
      primary: '#061218', //Main color
      primaryText: '#8F2AA3', //Color for text on primary
      secondary: '#F2A6FA', //Color for active nav
      lightText: '#F2A6FA'
  }
})

//Create the App with the router
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
