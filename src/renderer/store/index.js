import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    safeFlow: {},
    system: {'publickey': '', 'token': ''},
    context: {},
    science: {},
    tools: {},
    visulisation: {},
    visData: {},
    visOptions: {},
    testString: ''
  },
  getters: {
    liveSafeFlow: state => state.safeFlow,
    liveSystem: state => state.system,
    liveContext: state => state.context,
    liveScience: state => state.science,
    liveTools: state => state.tools,
    liveVis: state => state.visulisation,
    liveVisData: state => state.visData,
    liveVisOptions: state => state.visOptions,
    liveTeststring: state => state.testString
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
    setResolutiontype: (state, inVerified) => {
      state.context.resolution = inVerified
    },
    setVisual: (state, inVerified) => {
      state.visulisation = inVerified
    },
    setVisualData: (state, inVerified) => {
      state.visData = inVerified
    },
    setVisualOptions: (state, inVerified) => {
      state.visOptions = inVerified
    },
    setCNRLscience: (state, inVerified) => {
      state.science = inVerified
    },
    setTools: (state, inVerified) => {
      state.liveTools = inVerified
    },
    setTeststring: (state, inVerified) => {
      state.testString = inVerified
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
