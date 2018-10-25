import Vue from 'vue'
import Router from 'vue-router'

import homePage from '../pages/home.vue'
import protoFilesPage from '../pages/protoFiles'
import grpcPage from '../pages/grpc'
import kafkaPage from '../pages/kafka'

Vue.use(Router);

const router = new Router ({
  root: '/home',
  routes: 
  [
        {
          path: '/kafka',
          name: 'kafka',
          component: kafkaPage
        },
        {
          path: '/grpc',
          name: 'grpc',
          component: grpcPage
        },
        {
          path: '/proto-files',
          name: 'protos',
          component: protoFilesPage
        },
        {
          path: '/home',
          name: 'home',
          component: homePage
        },
        {
          path: '/',
          redirect: '/home'
        }
  ]
});

export default router