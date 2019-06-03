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
    visualisation: ['vis-sc-1'],
    visData: {},
    visOptions: {},
    testString: '',
    time: '',
    datatypes: [],
    bundle: {},
    startBundles: [],
    bundleCounter: 0
  },
  getters: {
    liveSafeFlow: state => state.safeFlow,
    liveSystem: state => state.system,
    liveContext: state => state.context,
    liveScience: state => state.science,
    liveTools: state => state.tools,
    liveVis: state => state.visualisation,
    liveVisData: state => state.visData,
    liveVisOptions: state => state.visOptions,
    liveTeststring: state => state.testString,
    liveTime: state => state.time,
    liveDatatypes: state => state.datatypes,
    liveBundle: state => state.bundle,
    startBundlesList: state => state.startBundles,
    liveBundleCounter: state => state.bundleCounter
  },
  mutations: {
    // Mutations
    setSafeflow: (state, inVerified) => {
      state.safeFlow = inVerified
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
      state.context.datatypes = inVerified
    },
    setResolutiontype: (state, inVerified) => {
      state.context.resolution = inVerified
    },
    setVisual: (state, inVerified) => {
      state.visualisation = inVerified
    },
    setVisualData: (state, inVerified) => {
      // state.visData = { ...state.visData, inVerified }
      state.visData = Vue.set(state, 'visData', inVerified)
      console.log(state.visData)
    },
    setVisualOptions: (state, inVerified) => {
      // state.visOptions = { ...state.visOptions, inVerified }
      state.visOptions = Vue.set(state, 'visOptions', inVerified)
    },
    setCNRLscience: (state, inVerified) => {
      state.science = inVerified
    },
    setTools: (state, inVerified) => {
      state.liveTools = inVerified
    },
    setTeststring: (state, inVerified) => {
      state.testString = inVerified
    },
    setTime: (state, inVerifed) => {
      state.time = inVerifed
    },
    setLiveBundle: (state, inVerified) => {
      state.bundle = Vue.set(state, 'bundle', inVerified)
      console.log(state.bundle)
    },
    updateLiveBTime: (state, inVerified) => {
      console.log('update time')
      console.log(inVerified)
      console.log(state.bundle.time.timeseg)
      // state.bundle.time.timeseg = inVerifed.timeseg
      // state.bundle.time.startperiod = inVerifed.startperiod
    },
    setStartKBundles: (state, inVerified) => {
      console.log('muit for KB')
      console.log(inVerified)
      state.startBundles = inVerified
    },
    setBCounter: (state, inVerified) => {
      console.log('add one to bundle counter')
      console.log(state.bundleCounter)
      console.log(inVerified)
      if (inVerified) {
        console.log('exist bid in store')
        state.bundleCounter = inVerified + 1
      } else {
        console.log('normal addd')
        state.bundleCounter++
      }
      console.log('bundle state counter END')
      console.log(state.bundleCounter)
    },
    setSortBCounter: (state, inVerified) => {
      console.log('add one to bundle counter')
      let currentBList = state.startBundles
      currentBList.sort(function (a, b) {
        return a.bid - b.bid
      })
      let lastBID = currentBList.slice(-1)
      console.log('slice of existing bids')
      console.log(lastBID)
      state.bundleCounter = lastBID[0].bid + 1
      console.log('post first create k klist hjostyr')
      console.log(state.bundleCounter)
    },
    setStartStatusUpdate: (state, inVerified) => {
      console.log('update a bundle item')
      let lss = {}
      lss.active = true
      lss.name = 'yes'
      for (let ukb of state.startBundles) {
        console.log(ukb.bid)
        console.log(inVerified)
        if (ukb.bid === inVerified) {
          console.log('match')
          ukb.startStatus = lss
        }
      }
    }
  },
  actions: {
    actionVisualOptions: (context, update) => {
      context.commit('setVisualOptions', update)
    },
    actionVisualData: (context, update) => {
      context.commit('setVisualData', update)
    },
    actionLiveBundle: (context, update) => {
      context.commit('setLiveBundle', update)
    },
    actionStartKBundles: (context, update) => {
      console.log('action kb')
      console.log(update)
      context.commit('setStartKBundles', update)
    },
    actionSortSKB: (context, update) => {
      // need set bidID to allow news additions
      context.commit('setSortBCounter', update)
    },
    actionUpdateBundleItem: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setStartStatusUpdate', update)
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
