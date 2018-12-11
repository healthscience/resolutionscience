import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/analysis',
      name: 'analysis-page',
      component: require('@/components/Analysis').default
    },
    {
      path: '/science',
      name: 'acc-page',
      component: require('@/components/Science').default
    },
    {
      path: '/datadevicesensor',
      name: 'data-page',
      component: require('@/components/DataDeviceSensor').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
