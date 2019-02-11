import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    safeFlow: {},
    system: {'publickey': '', 'token': ''},
    context: {},
    science: {}
  },
  getters: {
    liveSafeFlow: state => state.safeFlow,
    liveSystem: state => state.system,
    liveContext: state => state.context,
    liveScience: state => state.science
  },
  mutations: {
    // Mutations
    setSafeflow: (state, inVerified) => {
      state.safeFlow = inVerified
    },
    setsFlowTDB: (state, inVerified) => {
      state.safeFlow.liveDataSystem = inVerified
    },
    setBoth: (state, inVerified) => {
      state.system = inVerified
    },
    setPublickey: (state, inVerified) => {
      state.system.publickey = inVerified
    },
    setToken: (state, inVerified) => {
      state.system.token = inVerified
    },
    setScience: (state, inVerified) => {
      state.context.science = inVerified
    },
    setDevice: (state, inVerified) => {
      state.context.device = inVerified
    },
    setDatatype: (state, inVerified) => {
      state.context.datatype = inVerified
    },
    setVisual: (state, inVerified) => {
      state.context.vis = inVerified
    },
    setCNRLscience: (state, inVerified) => {
      state.science = inVerified
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
