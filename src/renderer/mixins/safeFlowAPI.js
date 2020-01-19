import SAFEflow from '../safeflow/safeFlow.js'
const moment = require('moment')

export default {
  data () {
    return {
      chartmessage: {}
    }
  },
  computed: {
    safeMixin: function () {
      let liveFlow = new SAFEflow()
      return liveFlow
    }
  },
  methods: {
    async connectNSnetwork (authType, authBundle) {
      // offline
      // connected annon
      // first time setup self verification
      // connect self verified
      if (authType === 'safenetwork') {
        // implement in network release see DIY repo on github.
      } else if (authType === 'cloud') {
        await this.startCycle(authBundle)
      }
    },
    async startCycle (authIN) {
      // AUTHORISATION KLB entry or non for network KBLedger
      let defaultAPI = '33221100'
      let authStatus = await this.checkAuthorisation(defaultAPI, authIN)
      if (authStatus === true) {
        // What network experiments are in this peers KBLedger? ie. existing joined or setup?
        // will provide API CONNECTIONS  ->devices ->Datatypes ->Computes --> visualisation
        // query peer ledger to extract experiments, computes i.e. KBLedger latest
        this.startNetworkExpMappedKbundles()
        this.startKSetting()
        // Independently extract devcies, datatypes, computes etc for Peer
        this.deviceContext()
        // this.datatypeContext()
        // this.cnrlScienceCompute()
      }
    },
    async checkAuthorisation (defaultAPI, authBundle) {
      let auth = false
      auth = await this.safeMixin.networkAuthorisation(defaultAPI, authBundle)
      return auth
    },
    async startNetworkExpMappedKbundles () {
      let mappedNetworkExpKbundles = await this.safeMixin.experimentKbundles('retreive')
      // extract the unique CNRL network experiment ids and look up info.
      let uniqueNXP = [...new Set(mappedNetworkExpKbundles.map(x => x.experimentCNRL))]
      // lookup CNRL for full info on the NXP
      let NXPlist = []
      for (let inxp of uniqueNXP) {
        let cnrlNXP = this.safeMixin.cnrlLookup(inxp)
        NXPlist.push(cnrlNXP)
      }
      // set via store and then pick up in historyData
      this.$store.dispatch('actionExperimentList', NXPlist)
      this.$store.dispatch('actionExperimentKBundles', mappedNetworkExpKbundles)
      // what other NXPs are available on the network?
      this.liveNetworkExperiments()
    },
    async startKSetting () {
      let startKset = await this.safeMixin.startSettings('retreive', null)
      // set via store and then pick up in historyData
      this.$store.dispatch('actionStartKBundles', startKset)
      this.startKup()
    },
    startKup () {
      const nowTime = moment()
      let startPeriodTime = moment.utc(nowTime).startOf('day')
      let MSstartTime = moment(startPeriodTime).format('x')
      this.$store.dispatch('actionComputeStatus', MSstartTime)
    },
    liveNetworkExperiments () {
      let experimentList = this.GETexperimentsList()
      console.log('experimentList')
      console.log(experimentList)
      this.$store.dispatch('actionNetworkExperimentList', experimentList)
    },
    async deviceContext () {
      const deviceFlag = 'device'
      let deviceList = await this.safeMixin.toolkitContext(deviceFlag)
      console.log('devices')
      console.log(deviceList)
      this.$store.dispatch('actionDeviceDataAPI', deviceList)
    },
    dataTypeContext () {
      // make call to set start dataType for the device sensors
      const dataTypeFlag = 'dataType'
      let datatypeList = this.GETtoolkitDatatypes(dataTypeFlag)
      this.$store.dispatch('actionSetDataTypes', datatypeList)
    },
    cnrlScienceCompute () {
      // call the CNRL api and get network science active
      let startScienceCompute = this.GetcnrlScienceStart()
      this.$store.commit('setCNRLscience', startScienceCompute)
    },
    async SAFEnetworkAuthorisation () {
      await this.safeMixin.SAFEsendAuthRequest()
    },
    async learnStart (lBundle) {
      // console.log('start Learning')
      // console.log(lBundle)
      let returnVISvue = {}
      this.chartmessage.text = 'Visualisation being prepared'
      this.chartmessage.active = true
      this.liveBundle = lBundle
      this.activeEntity = lBundle.kbid
      // set the visualisation require (need to be more complex ie. type, type chart colors etc)
      this.activevis = this.$store.getters.liveVis[0]
      // make the Entity
      await this.safeMixin.scienceEntities(lBundle)
      // this.learnListening()
      let entityGetter = await this.safeMixin.entityGetter(this.activeEntity, 'vis-sc-1')
      let entityGetterTable = await this.safeMixin.entityGetter(this.activeEntity, 'vis-sc-2')
      this.chartmessage.active = false
      // get the table visulisation
      returnVISvue = await this.diplayFilter(this.activeEntity, 'vis-sc-1', entityGetter)
      returnVISvue.table = entityGetterTable
      return returnVISvue
    },
    async diplayFilter (aEID, aVis, entityGetter) {
      // setup return vis Object
      let visObjectVUE = {}
      if (aVis === 'vis-sc-1') {
        if (entityGetter.chartMessage === 'computation in progress') {
        } else if (entityGetter.chartMessage === 'vis-report') {
          let recoveryStart = {}
          recoveryStart.seenStatus = true
          recoveryStart.hrcdata = entityGetter.hrcReport
          this.recoveryData = recoveryStart
        } else {
          this.chartmessage.text = 'computation up-to-date'
          this.options2 = entityGetter.liveChartOptions
          this.datacollection2 = entityGetter.chartPackage
          this.liveTimeV2 = moment(entityGetter.displayTime * 1000).format('LLLL')
          // this.liveanalysisStart = entityGetter.selectTimeStart
          this.liveSelectTime = this.liveanalysisStart
          let AvgDstart = await this.getAverages(aEID)
          this.options2.annotation.annotations[0].value = AvgDstart.avgdhr
          this.options2.annotation.annotations[1].value = AvgDstart.avgdrhr
          // visObjectVUE.kContext = this.liveanalysisStart
          visObjectVUE.displayTime = this.liveTimeV2
          visObjectVUE.displayTimeF = this.setFutureUItime(entityGetter.displayTime)
          visObjectVUE.liveOptions = this.options2
          visObjectVUE.liveDataCollection = this.datacollection2
        }
      } else if (this.activevis === 'vis-sc-2') {
        // localthis.tableHTML = entityGetter.table
      } else if (this.activevis === 'vis-sc-3') {
        // localthis.simulationHeart = entityGetter.heart
        // localthis.simulationMovement = entityGetter.heart
        // localthis.simulationTime = entityGetter.time
      }
      return visObjectVUE
    },
    setFutureUItime (curTime) {
      let futureTime = curTime + 86400
      let fTimeFormatted = moment(futureTime * 1000).format('LLLL')
      return fTimeFormatted
    },
    startComputeUpdate () {
      this.activedevice = this.$store.getters.liveContext
      this.liveFlow.computationSystem('wasm-sc-2', this.activedevice[0].device_mac)
      this.avgStatusCompMessage = 'Average compute is taking place'
      this.avgStatusCompute = true
    },
    learnListening () {
      var localthis = this
      // listening to give peer info. on computation statusTime
      this.safeMixin.liveEManager.on('computation', function (cState) {
        if (cState === 'in-progress') {
          localthis.chartmessage.text = cState
        } else {
          localthis.chartmessage.text = 'computation up-to-date'
        }
      })
    },
    async getAverages (eid) {
      // update latest daily average HR
      let AvgDailyHolder = {}
      let currentAHR = await this.safeMixin.entityCurrentAverageHR(eid, 'none')
      let newARHR = await this.safeMixin.entityCurrentAverageHR(eid, 'cnrl-8356388727')
      // let newARHR = 55
      AvgDailyHolder.avgdhr = currentAHR
      AvgDailyHolder.avgdrhr = newARHR
      // console.log(this.liveOptions)
      // this.liveOptions.annotation.annotations[0].value = newAHR
      // this.liveOptions.annotation.annotations[1].value = newARHR
      return AvgDailyHolder
    },
    timeRange () {
      let rangeHolder = {}
      rangeHolder.startTime = this.toolbarData.liveOptions.analysisStart
      rangeHolder.endTime = this.toolbarData.liveOptions.analysisEnd
      rangeHolder.active = true
      return rangeHolder
    },
    timeNav (navT) {
      let navTimelist = []
      navTimelist = this.safeMixin.cnrlTimeIndex(navT)
      return navTimelist
    },
    GETcnrlLivingKnowledge (cnrlID) {
      let knowledgeSpace = this.safeMixin.cnrlLivingKnowledge(cnrlID)
      return knowledgeSpace
    },
    saveStartBundle (bund) {
      // need up date startStatus Object
      this.safeMixin.startSettings('save', bund)
    },
    removeStartBundle (bund) {
      // need up date startStatus Object
      console.log('remove')
      this.safeMixin.startSettings('remove', bund)
    },
    removeStartDashboard (bund) {
      // need up date startStatus Object
      console.log('removedash')
      this.safeMixin.startSettings('removedash', bund)
    },
    async SaveexperimentKbundles (mapEKb) {
      let saveStatus = await this.safeMixin.experimentKbundles('save', mapEKb)
      return saveStatus
    },
    async mappedKBLexp () {
      let lastestMappedLedger = await this.safeMixin.experimentKbundles('retreive')
      return lastestMappedLedger
    },
    GETcnrlLookup (cnrl) {
      let getContract = this.safeMixin.cnrlLookup(cnrl)
      return getContract
    },
    GETexperimentsList () {
      let expList = this.safeMixin.cnrlExperimentIndex()
      return expList
    },
    GETdatatypeList () {
      let dtList = this.safeMixin.cnrlNetworkDatatypeIndex()
      return dtList
    },
    GetcnrlComputeList () {
      let computeList = this.safeMixin.cnrlNetworkComputeIndex()
      return computeList
    },
    GetcnrlScienceStart () {
      let scienceCompute = this.safeMixin.cnrlScienceStart()
      return scienceCompute
    },
    async GETtoolkitDatatypes (dapi, deviceFlag) {
      let datatypes = await this.safeMixin.toolkitContext(dapi, deviceFlag)
      return datatypes
    },
    GETcnrlDeviceDTs (cnrl) {
      let datatypesPerDevice = this.safeMixin.cnrlDeviceDTs(cnrl)
      return datatypesPerDevice
    },
    GETcnrlScienceDTs (sciIN) {
      let scieDTs = this.safeMixin.cnrlScienceDTs(sciIN)
      return scieDTs
    }
  }
}
