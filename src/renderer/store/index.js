import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    system: {'publickey': '', 'token': ''}
  },
  getters: {
    liveSystem: state => state.system
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
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
