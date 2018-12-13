import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    system: {'publickey': '', 'token': ''}
  },
  mutations: {
    // Mutations
    setToken: (state, inVerified) => {
      state.system = inVerified
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
