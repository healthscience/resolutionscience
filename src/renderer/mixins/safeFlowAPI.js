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
      console.log(lBundle)
      this.chartmessage.text = 'Visualisation being prepared'
      this.chartmessage.active = true
      this.liveBundle = lBundle
      this.activeEntity = lBundle.kbid
      this.activevis = this.$store.getters.liveVis[0]
      await this.safeMixin.scienceEntities(lBundle)
      console.log('entity setup/operational')
      // this.learnListening()
      let entityGetter = await this.safeMixin.entityGetter(this.activeEntity, this.activevis)
      console.log('VUE---return getter data')
      console.log(entityGetter)
      this.chartmessage.active = false
      returnVISvue = this.diplayFilter(this.activevis, this.activevis, entityGetter)
      return returnVISvue
    },
    diplayFilter (aEID, aVis, entityGetter) {
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
          console.log(entityGetter)
          console.log(aEID)
          this.chartmessage.text = 'computation up-to-date'
          this.options2 = entityGetter.liveChartOptions
          this.datacollection2 = entityGetter.chartPackage
          this.liveTimeV = moment(entityGetter.displayTime * 1000).format('LLLL')
          this.liveanalysisStart = entityGetter.selectTimeStart
          this.liveSelectTime = this.liveanalysisStart
          let AvgDstart = 34 // await this.getAverages(aEID)
          this.options2.annotation.annotations[0].value = AvgDstart.avgdhr
          this.options2.annotation.annotations[1].value = AvgDstart.avgdrhr
          visObjectVUE.kContext = this.liveanalysisStart
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
      console.log('vue vis object for UI')
      console.log(visObjectVUE)
      return visObjectVUE
    },
    startComputeUpdate () {
      this.activedevice = this.$store.getters.liveContext
      console.log('before active device')
      console.log(this.activedevice)
      this.liveFlow.computationSystem('wasm-sc-2', this.activedevice[0].device_mac)
      this.avgStatusCompMessage = 'Average compute is taking place'
      this.avgStatusCompute = true
    },
    learnListening () {
      var localthis = this
      // listening to give peer info. on computation statusTime
      this.safeMixin.liveEManager.on('computation', function (cState) {
        console.log('computation event from manager')
        console.log(cState)
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
      let currentAHR = await this.safeMixin.entityCurrentAverageHR(eid)
      console.log('averageHR current====')
      console.log(currentAHR)
      let newARHR = 55
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
    saveStartBundle (bund) {
      console.log(' go and save via safeFLOW')
      this.safeMixin.startSettings('save', bund)
    }
  }
}
