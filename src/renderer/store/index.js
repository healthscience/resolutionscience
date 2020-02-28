import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    liveNXP: '',
    liveNXPcontract: {},
    liveNXPbundle: {},
    dashboardNXP: {},
    liveNXPbundleList: [],
    newNXP: false,
    gridDefault: [
      { 'x': 0, 'y': 0, 'w': 20, 'h': 2, 'i': '0', static: true },
      { 'x': 0, 'y': 0, 'w': 2, 'h': 5, 'i': '1', static: false },
      { 'x': 4, 'y': 0, 'w': 2, 'h': 5, 'i': '2', static: false },
      { 'x': 6, 'y': 0, 'w': 2, 'h': 5, 'i': '3', static: false }
    ],
    compute: {},
    tools: {},
    visualisation: ['vis-sc-2'],
    visData: {},
    visOptions: {},
    testString: '',
    time: '',
    selectTime: [],
    datatypes: [],
    datatypesCNRL: [],
    bundle: {},
    startBundles: [],
    bundleCounter: 0,
    experimentStatus: {},
    NXPexperimentStatus: {},
    experimentList: [],
    NXPexperimentList: [],
    experimentProgressStatus: {},
    expEntities: {},
    mapExperimentKbundles: [],
    activeKentities: {},
    computeKidStatus: {}
  },
  getters: {
    liveNXPset: state => state.liveNXP,
    liveCompute: state => state.compute,
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
    liveExperimentStats: state => state.experimentStatus,
    liveNXPExperimentStats: state => state.NXPexperimentStatus,
    liveExperimentList: state => state.experimentList,
    liveNXPExperimentList: state => state.NXPexperimentList,
    livemapExperimentKbundles: state => state.mapExperimentKbundles,
    liveKentities: state => state.activeKentities,
    liveKComputeStatus: state => state.computeKidStatus
  },
  mutations: {
    // Mutations
    setScience: (state, inVerified) => {
      state.context.science = inVerified
    },
    updateDevice: (state, inVerified) => {
      state.context.device = []
      state.context.device = inVerified
    },
    updateDeviceState: (state, inVerified) => {
      // set active Device
      state.context.livedevice = inVerified.device_mac
      for (let dev of state.context.device) {
        if (dev.device_mac === inVerified.device_mac) {
          inVerified.active = !inVerified.active
          dev = inVerified
        }
      }
    },
    addDevice: (state, inVerified) => {
      state.context.device.push(inVerified)
    },
    updateDTState: (state, inVerified) => {
      let liveDev = state.context.livedevice
      let liveDeviceDTs = state.context.datatypes[liveDev]
      for (let dt of liveDeviceDTs.datatypes) {
        if (dt.cnrl === inVerified.cnrl) {
          inVerified.active = !inVerified.active
          dt = inVerified
        }
      }
    },
    setResolutiontype: (state, inVerified) => {
      state.context.resolution = inVerified
    },
    setVisual: (state, inVerified) => {
      state.visualisation = inVerified
    },
    setVisualData: (state, inVerified) => {
      state.visData = Vue.set(state, 'visData', inVerified)
    },
    setVisualOptions: (state, inVerified) => {
      // state.visOptions = { ...state.visOptions, inVerified }
      state.visOptions = Vue.set(state, 'visOptions', inVerified)
    },
    setCNRLcompute: (state, inVerified) => {
      state.compute = inVerified
    },
    setTools: (state, inVerified) => {
      state.liveTools = inVerified
    },
    setTeststring: (state, inVerified) => {
      state.testString = inVerified
    },
    setSelectTime: (state, inVerifed) => {
      state.selectTime = inVerifed
    },
    setTimeOptionState: (state, inVerified) => {
      for (let ts of state.selectTime) {
        if (ts.id === inVerified.id) {
          inVerified.active = !inVerified.active
          ts = inVerified
        }
      }
    },
    setLiveBundle: (state, inVerified) => {
      state.bundle = Vue.set(state, 'bundle', inVerified)
    },
    setBundlestartTime: (state, inVerified) => {
      // state.bundle.time.startperiod = inVerified
      Vue.set(state.bundle.time, 'startperiod', inVerified)
    },
    setLiveBundleNav: (state, inVerified) => {
      // reform kbinput object
      let reformKBbundle = {}
      reformKBbundle = state.bundle
      inVerified.time.realtime = state.bundle.time.realtime
      reformKBbundle.time = inVerified.time
      // Vue.set(state.bundle, 'time', inVerified.time)
      state.bundle = reformKBbundle
    },
    setSciCompute: (state, inVerified) => {
      let sciCompute = {}
      sciCompute.cnrl = inVerified
      state.bundle.scienceLive = sciCompute
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
      let openStatus = {active: false, text: 'Compute-in-progress', update: '---', seen: false}
      Vue.set(state.computeKidStatus, inVerified.kbid, openStatus)
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
      // prepare object to hold compute state per entity kbid
      let computeStatus = {active: false, text: 'Compute-in-progress', update: '---', seen: true}
      Vue.set(state.computeKidStatus, inVerified, computeStatus)
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
    setExperimentStatus: (state, inVerified) => {
      let newData = inVerified.dashKBlist
      if (inVerified.view === true) {
        let kel = {}
        kel.status = true
        // kel.dashKBlist = newData
        kel.contract = inVerified.contract
        kel.cnrl = inVerified.cnrl
        let objectProp = inVerified.cnrl
        // Vue.set(state.experimentStatus, objectProp, kel)
        Vue.set(state.experimentStatus[objectProp], 'dashKBlist', newData)
        Vue.set(state.experimentStatus[objectProp], 'status', true)
      }
    },
    setExperimentStatusc: (state, inVerified) => {
      if (inVerified.view === false) {
        let updateExpState = {}
        updateExpState.cnrl = inVerified.cnrl
        updateExpState.contract = inVerified.contract
        updateExpState.status = false
        updateExpState.dashKBlist = inVerified.dashKBlist
        let objectPropC = inVerified.cnrl
        Vue.set(state.experimentStatus, objectPropC, updateExpState)
      }
    },
    setExperimentList: (state, inVerified) => {
      state.experimentList = inVerified
      for (let exl of state.experimentList) {
        let experBundle = {}
        experBundle.cnrl = exl.prime.cnrl
        experBundle.status = false
        experBundle.contract = exl
        experBundle.dashKBlist = []
        let objectPropC = exl.prime.cnrl
        Vue.set(state.experimentStatus, objectPropC, experBundle)
      }
      state.activeKentities = {}
      for (let budi of state.experimentList) {
        let objectPropE = budi.prime.cnrl
        Vue.set(state.activeKentities, objectPropE, [])
        for (let expCNRL of state.mapExperimentKbundles) {
          if (budi.prime.cnrl === expCNRL.experimentCNRL) {
            let objectProp = budi.prime.cnrl
            let objectValue = expCNRL.kbid
            state.activeKentities[objectProp].push(objectValue)
          }
          // setup progress message holder object
          let progressSet = {}
          progressSet.active = false
          progressSet.cnrl = objectPropE
          progressSet.text = 'Visulisation in Progress'
          Vue.set(state.experimentProgressStatus, objectPropE, progressSet)
        }
      }
    },
    setNetworkExperimentList: (state, inVerified) => {
      state.NXPexperimentList = inVerified
      for (let exl of state.NXPexperimentList) {
        let experBundle = {}
        experBundle.cnrl = exl.prime.cnrl
        experBundle.status = false
        experBundle.contract = exl
        experBundle.dashKBlist = []
        let objectPropC = exl.prime.cnrl
        Vue.set(state.NXPexperimentStatus, objectPropC, experBundle)
      }
      /* state.activeKentities = {}
      for (let budi of state.NXPexperimentList) {
        let objectPropE = budi.prime.cnrl
        Vue.set(state.activeKentities, objectPropE, [])
        for (let expCNRL of state.mapExperimentKbundles) {
          if (budi.prime.cnrl === expCNRL.experimentCNRL) {
            let objectProp = budi.prime.cnrl
            let objectValue = expCNRL.kbid
            state.activeKentities[objectProp].push(objectValue)
          }
          // setup progress message holder object
          let progressSet = {}
          progressSet.active = false
          progressSet.cnrl = objectPropE
          progressSet.text = 'Visulisation in Progress'
          Vue.set(state.experimentProgressStatus, objectPropE, progressSet)
        }
      } */
    },
    setMappedExpKbundles: (state, inVerified) => {
      state.mapExperimentKbundles = inVerified
    },
    setMappedExpKbundlesItem: (state, inVerified) => {
      state.mapExperimentKbundles.push(inVerified)
    },
    removeMappedExpKbundlesItem: (state, inVerified) => {
      const items = state.mapExperimentKbundles
      const manFilter = (e, tItem) => {
        let filterMat = null
        if (e.kbid === tItem.kbid && e.experimentCNRL === tItem.experimentCNRL) {
          filterMat = false
        } else {
          filterMat = true
        }
        return filterMat
      }
      state.mapExperimentKbundles = items.filter(n => manFilter(n, inVerified))
    },
    setKentitiesItem: (state, inVerified) => {
      let objectProp = inVerified.experimentCNRL
      let objectValue = inVerified.kbid
      // Vue.set(estate.activeKentities, objectProp, objectValue)
      state.activeKentities[objectProp].push(objectValue)
    },
    removeKentitiesItem: (state, inVerified) => {
      let newKIBlist = []
      let objectProp = inVerified.experimentCNRL
      // need to loop over exisitng and remove and push new list
      for (let kb of state.activeKentities[objectProp]) {
        if (kb !== inVerified.kbid) {
          newKIBlist.push(kb)
        }
      }
      state.activeKentities[objectProp] = newKIBlist
    },
    updateChartOptions: (state, inVerified) => {
      let listKBs = state.experimentStatus[inVerified.expCNRL]
      let indexK = 0
      for (let kb of listKBs.dashKBlist) {
        Vue.set(state.experimentStatus[inVerified.expCNRL].dashKBlist[indexK], 'liveOptions', kb.syncOptions)
        indexK++
      }
      // console.log('sate at end')
      // console.log(state.experimentStatus[inVerified.expCNRL])
    },
    startExperimentProgressStatus: (state, inVerified) => {
      Vue.set(state.experimentProgressStatus, inVerified.cnrl, inVerified)
    },
    ExperimentProgressStatusFalse: (state, inVerified) => {
      let setFalseCNRL = inVerified.cnrl
      Vue.set(state.experimentProgressStatus[setFalseCNRL], 'active', false)
    },
    setDTcnrl: (state, inVerified) => {
      state.datatypesCNRL = inVerified
    },
    setLiveNXP: (state, inVerified) => {
      state.liveNXP = inVerified
      for (let nxpC of state.NXPexperimentList) {
        if (nxpC.prime.cnrl === inVerified) {
          state.liveNXPcontract = nxpC
        }
      }
    },
    setLiveNXPBundle: (state, inVerified) => {
      state.liveNXPbundle = {}
      state.liveNXPbundleList = []
      let kBidlive = []
      for (let kItem of state.mapExperimentKbundles) {
        if (kItem.experimentCNRL === inVerified) {
          kBidlive.push(kItem.kbid)
        }
      }
      // loop up kBID and extract elements mapExperimentKbundles
      let KbidsList = []
      for (let kBentry of state.startBundles) {
        for (let kitem of kBidlive) {
          if (kBentry.kbid === kitem) {
            KbidsList.push(kitem)
            Vue.set(state.liveNXPbundle, kitem, kBentry)
          }
        }
      }
      state.liveNXPbundleList = KbidsList
    },
    setNewNXP: (state, inVerified) => {
      state.newNXP = inVerified
    },
    setDashboardNXP: (state, inVerified) => {
      let dStatus = state.experimentStatus[inVerified].active
      dStatus = !dStatus
      Vue.set(state.experimentStatus[inVerified], 'active', dStatus)
    },
    setPrepareBundle: (state, inVerified) => {
      console.log('prepare data for bundle')
      console.log(state.liveNXP)
      console.log(state.liveNXPcontract)
      console.log(state.liveNXPbundle)
    },
    setLayoutGrid: (state, inVerified) => {
      console.log('update gride')
      state.gridDefault = inVerified
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
      context.commit('setExperimentStatus', update)
    },
    actionUpdateExperimentC: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentStatusc', update)
    },
    actionExperimentList: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setExperimentList', update)
    },
    actionNetworkExperimentList: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('setNetworkExperimentList', update)
    },
    actionExperimentProgressStatus: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('startExperimentProgressStatus', update)
    },
    actionExperimentProgressStatusFalse: (context, update) => {
    // update settings to show at startup per bundle item
      context.commit('ExperimentProgressStatusFalse', update)
    },
    actionExperimentKBundles: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('setMappedExpKbundles', update)
    },
    actionExperimentKBundlesItem: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('setMappedExpKbundlesItem', update)
    },
    actionRemoveExpDashMap: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('removeMappedExpKbundlesItem', update)
    },
    actionUpdateKentitiesByKID: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('setKentitiesItem', update)
    },
    actionRemoveKentitiesByKID: (context, update) => {
    // update peers ExerperimentCNRLs to KBundles
      context.commit('removeKentitiesItem', update)
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
    actionDeviceUpdateOK: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateDevice', update)
    },
    actionAddDeviceDataAPI: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('addDevice', update)
    },
    actionUpdateChartOptions: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('updateChartOptions', update)
    },
    actionCNRLcompute: (context, update) => {
      context.commit('setCNRLcompute', update)
    },
    actionTIMEindex: (context, update) => {
      context.commit('setSelectTime', update)
    },
    actionUpateTimeOption: (context, update) => {
      context.commit('setTimeOptionState', update)
    },
    actionUpateDeviceState: (context, update) => {
      context.commit('updateDeviceState', update)
    },
    actionUpateDTState: (context, update) => {
      context.commit('updateDTState', update)
    },
    actionDTlist: (context, update) => {
      context.commit('setDTcnrl', update)
    },
    actionSetNXP: (context, update) => {
      context.commit('setLiveNXP', update)
      context.commit('setLiveNXPBundle', update)
    },
    actionNewNXP: (context, update) => {
      context.commit('setNewNXP', update)
      context.commit('setLiveNXPBundle', update)
    },
    actionDashboardState: (context, update) => {
      context.commit('setLiveNXP', update)
      context.commit('setLiveNXPBundle', update)
      context.commit('setDashboardNXP', update)
      context.commit('setPrepareBundle', update)
    },
    actionBundleData: (context, update) => {
      context.commit('setPrepareBundle', update)
    },
    actionGrideupdate: (context, update) => {
      context.commit('setLayoutGrid', update)
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
