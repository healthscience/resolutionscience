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
    async learnStart (lBundle) {
      console.log('start Learning')
      let returnVISvue = {}
      this.chartmessage.text = 'Visualisation being prepared'
      this.chartmessage.active = true
      this.liveBundle = lBundle
      this.activeEntity = lBundle.kbid
      this.activevis = this.$store.getters.liveVis[0]
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
    saveStartBundle (bund) {
      // need up date startStatus Object
      let updateStartStatus = {'active': true, 'name': 'yes'}
      bund.startStatus = updateStartStatus
      this.safeMixin.startSettings('save', bund)
    },
    async SaveexperimentKbundles (mapEKb) {
      let saveStatus = await this.safeMixin.experimentKbundles('save', mapEKb)
      return saveStatus
    }
  }
}
