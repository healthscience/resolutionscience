import SAFEflow from '../safeflow/safeFlow.js'
const moment = require('moment')

export default {
  data () {
    return {
      chartmessage: {}
    }
  },
  computed: {
    system: function () {
      return this.$store.state.system
    },
    safeMixin: function () {
      let liveFlow = new SAFEflow(this.system)
      return liveFlow
    }
  },
  methods: {
    async SAFEnetworkAuthorisation () {
      await this.safeMixin.SAFEsendAuthRequest()
    },
    async learnStart (lBundle) {
      console.log('start Learning')
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
      let entityGetter = await this.safeMixin.entityGetter(this.activeEntity, this.activevis)
      this.chartmessage.active = false
      returnVISvue = await this.diplayFilter(this.activeEntity, this.activevis, entityGetter)
      return returnVISvue
    },
    async diplayFilter (aEID, aVis, entityGetter) {
      // setup return vis Object
      let visObjectVUE = {}
      if (aVis === 'vis-sc-1') {
        console.log('chartjs')
        if (entityGetter.chartMessage === 'computation in progress') {
          console.log('chartjs--ongoing computation or obseration data')
          // this.chartmessage = entityGetter.chartMessage
          // this.options = entityGetter.chartPackage.options
          // this.datacollection = entityGetter.chartPackage.prepared
          // this.liveTime = entityGetter.chartPackage.livetime
        } else if (entityGetter.chartMessage === 'vis-report') {
          console.log('prepare report for HR recovery')
          let recoveryStart = {}
          recoveryStart.seenStatus = true
          recoveryStart.hrcdata = entityGetter.hrcReport
          this.recoveryData = recoveryStart
        } else {
          console.log('chartjs-- uptodate finised')
          this.chartmessage.text = 'computation up-to-date'
          this.options2 = entityGetter.liveChartOptions
          this.datacollection2 = entityGetter.chartPackage
          this.liveTimeV2 = moment(entityGetter.displayTime * 1000).format('LLLL')
          this.liveanalysisStart = entityGetter.selectTimeStart
          this.liveSelectTime = this.liveanalysisStart
          let AvgDstart = await this.getAverages(aEID)
          this.options2.annotation.annotations[0].value = AvgDstart.avgdhr
          this.options2.annotation.annotations[1].value = AvgDstart.avgdrhr
          visObjectVUE.kContext = this.liveanalysisStart
          visObjectVUE.displayTime = this.liveTimeV2
          visObjectVUE.displayTimeF = this.setFutureUItime(entityGetter.displayTime)
          visObjectVUE.liveOptions = this.options2
          visObjectVUE.liveDataCollection = this.datacollection2
        }
      } else if (this.activevis === 'vis-sc-2') {
        console.log('tablejs')
        // localthis.tableHTML = entityGetter.table
      } else if (this.activevis === 'vis-sc-3') {
        console.log('simjs')
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
    async SaveexperimentKbundles (mapEKb) {
      let saveStatus = await this.safeMixin.experimentKbundles('save', mapEKb)
      return saveStatus
    },
    async mappedKBLexp () {
      let lastestMappedLedger = await this.safeMixin.experimentKbundles('retreive')
      return lastestMappedLedger
    },
    async latestKBL () {
      let lastestLedger = await this.safeMixin.startSettings('retreive')
      return lastestLedger
    },
    GETcnrlLookup (cnrl) {
      let getContract = this.safeMixin.cnrlLookup(cnrl)
      return getContract
    },
    GETexperimentsList () {
      let expList = this.safeMixin.cnrlExperimentIndex()
      return expList
    },
    GetcnrlScienceStart () {
      let scienceCompute = this.safeMixin.cnrlScienceStart()
      return scienceCompute
    },
    async GETtoolkitDevices (dapi, deviceFlag) {
      let devices = await this.safeMixin.toolkitContext(dapi, deviceFlag)
      return devices
    },
    async GETtoolkitDatatypes (dapi, deviceFlag) {
      let devices = await this.safeMixin.toolkitContext(dapi, deviceFlag)
      return devices
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
