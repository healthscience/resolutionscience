import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    system: {'publickey': '', 'token': ''},
    context: {}
  },
  getters: {
    liveSystem: state => state.system,
    liveContext: state => state.context
  },
  mutations: {
    // Mutations
    setBoth: (state, inVerified) => {
      state.system = inVerified
    },
    setPublickey: (state, inVerified) => {
      state.system.publickey = inVerified
    },
    setToken: (state, inVerified) => {
      state.system.token = inVerified
    },
    setContext: (state, inVerified) => {
      state.context = inVerified
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
