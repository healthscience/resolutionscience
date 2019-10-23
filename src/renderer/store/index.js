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
    visualisation: ['vis-sc-2'],
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
    updateDevice: (state, inVerified) => {
      state.context.device = []
      state.context.device = inVerified
    },
    addDevice: (state, inVerified) => {
      state.context.device.push(inVerified)
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
    setBundlestartTime: (state, inVerified) => {
      state.bundle.time.startperiod = inVerified
    },
    setSciCompute: (state, inVerified) => {
      let sciCompute = {}
      sciCompute.cnrl = inVerified
      state.bundle.scienceLive = sciCompute
    },
    setLiveBundleNav: (state, inVerified) => {
      console.log('nave seg nave update fo bundel')
      console.log(inVerified)
      console.log(inVerified.time.laststartperiod)
      inVerified.time.realtime = state.bundle.time.realtime
      console.log(inVerified.time.timevis)
      // state.bundle = Vue.set(state.bundle, 'time', inVerified.time)
      state.bundle.time = inVerified.time
      console.log(state.bundle.time.laststartperiod)
    },
    updateLiveBTime: (state, inVerified) => {
      console.log(inVerified)
    },
    setStartKBundles: (state, inVerified) => {
      // need to update time to today
      state.startBundles = inVerified
    },
    setStartKBundlesItem: (state, inVerified) => {
      state.startBundles.push(inVerified)
    },
    setComputeStatus: (state, startPeriodTime) => {
      // prepare object to hold compute state per entity kbid
      let openStatus = {active: false, text: 'Compute-in-progress', update: '---', seen: false}
      for (let kItem of state.startBundles) {
        let kID = kItem.kbid
        // is the bundleData behind real time?
        let d = new Date(kItem.time.startperiod) // new Date(kItem.time.startperiod)
        let n = d.getTime()
        if (startPeriodTime > n) {
          openStatus.update = 'needs updating'
          Vue.set(state.computeKidStatus, kID, openStatus)
        } else {
          Vue.set(state.computeKidStatus, kID, openStatus)
        }
      }
    },
    updateSeenComputeStatus: (state, inVerified) => {
      console.log('compute seen status')
      console.log(inVerified)
      console.log('PRE state')
      console.log(state.computeKidStatus)
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: false, text: 'Compute-in-progress', update: '---', seen: true}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
      console.log('post state')
      console.log(state.computeKidStatus)
    },
    updateComputeStatus: (state, inVerified) => {
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: true, text: 'Compute-in-progress', update: '---', seen: true}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
    },
    stopComputeStatus: (state, inVerified) => {
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: false, text: 'Compute-in-progress', update: 'up-to-date', seen: false}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
    },
    setStartStatusUpdate: (state, inVerified) => {
      let lss = {}
      lss.active = true
      lss.name = 'yes'
      for (let ukb of state.startBundles) {
        if (ukb.kbid === inVerified) {
          ukb.startStatus = lss
        }
      }
    },
    setExperimentCNRL: (state, inVerified) => {
      if (inVerified.view === true) {
        let kel = {}
        kel.status = true
        kel.dashKBlist = inVerified.dashKBlist
        kel.contract = inVerified.contract
        kel.cnrl = inVerified.cnrl
        let objectProp = inVerified.cnrl
        Vue.set(state.experimentCNRL, objectProp, kel)
        // take Kbundles list and prepare for display
        /* for (let kel of state.experimentList) {
          if (inVerified.cnrl === kel.cnrl) {
            kel.status = true
            kel.dashKBlist = inVerified.dashKBlist
            let objectProp = inVerified.cnrl
            Vue.set(state.experimentCNRL, objectProp, kel)
          }
        } */
      }
    },
    setExperimentCNRLc: (state, inVerified) => {
      if (inVerified.view === false) {
        let updateExpState = {}
        updateExpState.cnrl = inVerified.cnrl
        updateExpState.contract = {}
        updateExpState.status = false
        updateExpState.dashKBlist = inVerified.dashKBlist
        let objectPropC = inVerified.cnrl
        Vue.set(state.experimentCNRL, objectPropC, updateExpState)
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
    },
    updateChartOptions: (state, inVerified) => {
      let listKBs = state.experimentCNRL[inVerified.expCNRL]
      let indexK = 0
      for (let kb of listKBs.dashKBlist) {
        Vue.set(state.experimentCNRL[inVerified.expCNRL].dashKBlist[indexK], 'liveOptions', kb.syncOptions)
        indexK++
      }
      // console.log('sate at end')
      // console.log(state.experimentCNRL[inVerified.expCNRL])
    },
    removeExpDashMap: (state, inVerified) => {
      // loop over maplist and remove
      let updatedEDmap = []
      for (let med of state.mapExperimentKbundles) {
        if (med.kbid !== inVerified) {
          updatedEDmap.push(med)
        }
      }
      state.mapExperimentKbundles = updatedEDmap
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
    actionLiveBundleNav: (context, update) => {
      context.commit('setLiveBundleNav', update)
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
    actionUpdateSciCompute: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setSciCompute', update)
    },
    actionUpdateExperiment: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentCNRL', update)
    },
    actionUpdateExperimentC: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentCNRLc', update)
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
    actionUpdateSeenComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateSeenComputeStatus', update)
    },
    actionUpdateComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateComputeStatus', update)
    },
    actionstopComputeStatus: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('stopComputeStatus', update)
    },
    actionDeviceDataAPI: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setDevice', update)
    },
    actionDeviceUpdateOK: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateDevice', update)
    },
    actionAddDeviceDataAPI: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('addDevice', update)
    },
    actionSetDataTypes: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setDatatype', update)
    },
    actionUpdateChartOptions: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateChartOptions', update)
    },
    actionRemoveExpDashMap: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('removeExpDashMap', update)
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
