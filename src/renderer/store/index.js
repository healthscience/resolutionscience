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
    bundleCounter: 0,
    experimentCNRL: {},
    experimentList: {},
    expEntities: {},
    mapExperimentKbundles: [],
    activeKentities: []
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
    liveBundleCounter: state => state.bundleCounter,
    liveExperiment: state => state.experimentCNRL,
    liveExperimentList: state => state.experimentList,
    livemapExperimentKbundles: state => state.mapExperimentKbundles,
    liveKentities: state => state.activeKentities
  },
  mutations: {
    // Mutations
    setSafeflow: (state, inVerified) => {
      state.safeFlow = inVerified
    },
    setBoth: (state, inVerified) => {
      state.system = inVerified
      state.system.cnrl = 'cnrl-33221101'
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
    },
    updateLiveBTime: (state, inVerified) => {
      console.log('update time')
      console.log(inVerified)
      console.log(state.bundle.time.timeseg)
      // state.bundle.time.timeseg = inVerifed.timeseg
      // state.bundle.time.startperiod = inVerifed.startperiod
    },
    setStartKBundles: (state, inVerified) => {
      state.startBundles = inVerified
    },
    setBCounter: (state, inVerified) => {
      if (inVerified) {
        state.bundleCounter = inVerified + 1
      } else {
        state.bundleCounter++
      }
    },
    setSortBCounter: (state, inVerified) => {
      let currentBList = state.startBundles
      currentBList.sort(function (a, b) {
        return a.bid - b.bid
      })
      let lastBID = currentBList.slice(-1)
      state.bundleCounter = lastBID[0].bid + 1
    },
    setStartStatusUpdate: (state, inVerified) => {
      let lss = {}
      lss.active = true
      lss.name = 'yes'
      for (let ukb of state.startBundles) {
        if (ukb.bid === inVerified) {
          ukb.startStatus = lss
        }
      }
    },
    setBundlestartTime: (state, inVerified) => {
      // TEMP add cateogry data
      state.bundle.categories = []
      state.bundle.time.startperiod = inVerified
    },
    setExperimentCNRL: (state, inVerified) => {
      if (inVerified.view === true) {
        // take Kbundles list and prepare for display
        for (let kel of state.experimentList) {
          if (inVerified.cnrl === kel.cnrl) {
            kel.status = true
            let objectProp = inVerified.cnrl
            Vue.set(state.experimentCNRL, objectProp, kel)
            console.log('experimentCNRL selected')
            console.log(state.experimentCNRL)
          }
        }
      } else {
        // set to fase the experiment entity
        let updateECNRL = state.experimentCNRL[inVerified.cnrl]
        updateECNRL.status = false
        Vue.set(state.experimentCNRL, inVerified.cnrl, updateECNRL)
      }
    },
    setExperimentList: (state, inVerified) => {
      state.experimentList = inVerified
    },
    setMappedExpKbundles: (state, inVerified) => {
      state.mapExperimentKbundles = inVerified
    },
    filterKbundles: (state, inVerified) => {
      console.log('filter Experiments for Kbundles')
      for (let expCNRL of state.mapExperimentKbundles) {
        if (expCNRL.experimentCNRL === inVerified) {
          state.activeKentities.push(expCNRL.kbid)
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
      context.commit('setStartKBundles', update)
    },
    actionSortSKB: (context, update) => {
      // need set bidID to allow news additions
      context.commit('setSortBCounter', update)
    },
    actionUpdateBundleItem: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setStartStatusUpdate', update)
    },
    actionUpdateStartTime: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setBundlestartTime', update)
    },
    actionUpdateExperiment: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentCNRL', update)
    },
    actionExperimentList: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentList', update)
    },
    actionExperimentKBundles: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('setMappedExpKbundles', update)
    },
    actionFilterKBundles: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('filterKbundles', update)
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
