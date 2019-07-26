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
    activeKentities: {},
    computeKidStatus: {}
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
    liveKentities: state => state.activeKentities,
    liveKComputeStatus: state => state.computeKidStatus
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
      state.context.device = Vue.set(state, 'device', inVerified)
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
    setStartKBundlesItem: (state, inVerified) => {
      state.startBundles.push(inVerified)
    },
    setComputeStatus: (state, startPeriodTime) => {
      // prepare object to hold compute state per entity kbid
      let openStatus = {active: false, text: 'Compute-in-progress', update: '---'}
      for (let kItem of state.startBundles) {
        let kID = kItem.kbid
        // is the bundleData behind real time?
        console.log('time start status')
        console.log(kItem.time.startperiod)
        let d = new Date(kItem.time.startperiod) // new Date(kItem.time.startperiod)
        console.log(d)
        let n = d.getTime()
        console.log(n)
        console.log(startPeriodTime)
        if (startPeriodTime > n) {
          openStatus.update = 'needs updating'
          Vue.set(state.computeKidStatus, kID, openStatus)
        } else {
          Vue.set(state.computeKidStatus, kID, openStatus)
        }
      }
    },
    updateComputeStatus: (state, inVerified) => {
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: true, text: 'Compute-in-progress', update: '---'}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
    },
    stopComputeStatus: (state, inVerified) => {
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: false, text: 'Compute-in-progress', update: 'up-to-date'}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
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
    setMappedExpKbundlesItem: (state, inVerified) => {
      state.mapExperimentKbundles.push(inVerified)
    },
    filterKbundles: (state) => {
      state.activeKentities = {}
      for (let budi of state.experimentList) {
        let objectPropE = budi.cnrl
        Vue.set(state.activeKentities, objectPropE, [])
        for (let expCNRL of state.mapExperimentKbundles) {
          if (budi.cnrl === expCNRL.experimentCNRL) {
            let objectProp = budi.cnrl
            let objectValue = expCNRL.kbid
            state.activeKentities[objectProp].push(objectValue)
          }
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
    actionStartKBundlesItem: (context, update) => {
      context.commit('setStartKBundlesItem', update)
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
    actionExperimentKBundlesItem: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('setMappedExpKbundlesItem', update)
    },
    actionFilterKBundles: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('filterKbundles', update)
    },
    actionComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setComputeStatus', update)
    },
    actionUpdateComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateComputeStatus', update)
    },
    actionstopComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('stopComputeStatus', update)
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
