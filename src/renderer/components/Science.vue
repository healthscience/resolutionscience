<template>
  <div id="science">
    <h1>DIY Science & Computations</h1>
    <button class="" href="" id="add-new-science" @click.prevent="addnewScience()">New Science</button>
    <!-- <section v-if="newScienceSeen" id="new-science"> -->
    <!--<science-contribute  :contributeData="contributeData"></science-contribute>-->
    <!--<science-list></science-list>-->
    <knowledge-Context :kContext="kContext"></knowledge-Context>
  </div>
</template>

<script>
import SAFEflow from '../safeflow/safeFlow.js'
import scienceList from '@/components/healthscience/scienceData.vue'
import scienceContribute from '@/components/healthscience/scienceContribute.vue'
import KnowledgeContext from '@/components/toolbar/knowledgeContext'
const moment = require('moment')

export default {
  name: 'Science',
  components: {
    scienceList,
    scienceContribute,
    KnowledgeContext
  },
  data () {
    return {
      liveFlow: null,
      kContext: {},
      avgStatusCompute: false,
      avgStatusCompMessage: '',
      newScienceSeen: false,
      contributeData: {},
      updatecompute:
      {
        name: 'Update Computations',
        id: 'update-compute-1',
        active: false
      },
      updatecompute2:
      {
        name: 'Update Computations 2',
        id: 'update-compute-2',
        active: false
      },
      activedevice: '',
      activesensor: '',
      activecompute: '',
      activeupdatecompute: '',
      activeupdatecompute2: '',
      activevis: '',
      computeFlag: ''
    }
  },
  computed: {
    system: function () {
      return this.$store.state.system
    }
  },
  created () {
    this.setAccess()
  },
  methods: {
    setAccess () {
      this.liveFlow = new SAFEflow(this.system)
    },
    async getAverages (eid) {
      // update latest daily average HR
      let AvgDailyHolder = {}
      let currentAHR = await this.liveSafeFlow.entityCurrentAverageHR(eid)
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
    async learnStart (lBundle) {
      console.log('start Learning')
      console.log(lBundle)
      this.chartmessage.text = 'Visualisation being prepared'
      this.chartmessage.active = true
      this.liveBundle = lBundle
      this.activeEntity = lBundle.cnrl
      this.activevis = this.$store.getters.liveVis[0]
      await this.liveSafeFlow.scienceEntities(lBundle)
      console.log('entity setup/operational')
      this.learnListening()
      let entityGetter = await this.liveSafeFlow.entityGetter(this.activeEntity, this.activevis)
      console.log('VUE---return getter data')
      console.log(entityGetter)
      this.chartmessage.active = false
      if (this.activevis === 'vis-sc-1') {
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
          this.chartmessage.text = 'computation up-to-date'
          this.options2 = entityGetter[0].liveChartOptions
          this.datacollection2 = entityGetter[0].chartPackage
          this.liveTimeV = moment(entityGetter[0].displayTime * 1000).format('LLLL')
          this.liveanalysisStart = entityGetter[0].selectTimeStart
          this.liveSelectTime = this.liveanalysisStart
          let AvgDstart = await this.getAverages(this.activeEntity)
          this.options2.annotation.annotations[0].value = AvgDstart.avgdhr
          this.options2.annotation.annotations[1].value = AvgDstart.avgdrhr
          this.kContext = this.liveanalysisStart
          this.liveOptions = this.options2
          this.liveDataCollection = this.datacollection2
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
    },
    startComputeUpdate () {
      this.activedevice = this.$store.getters.liveContext
      console.log('before active device')
      console.log(this.activedevice)
      this.liveFlow.computationSystem('wasm-sc-2', this.activedevice[0].device_mac)
      this.avgStatusCompMessage = 'Average compute is taking place'
      this.avgStatusCompute = true
    },
    selectContext (s) {
      s.active = !s.active
    },
    filterDeviceActive () {
      if (this.device1.active === true) {
        this.activedevice = this.device1.id
      } else if (this.device2.active === true) {
        this.activedevice = this.device2.id
      }
    },
    filterSensorActive () {
      if (this.sensor1.active === true) {
        this.activesensor = this.sensor1.id
      } else if (this.sensor2.active === true) {
        this.activesensor = this.sensor2.id
      }
    },
    filterScienceActive () {
      if (this.compute1.active === true) {
        this.activecompute = this.compute1.id
      } else if (this.compute2.active === true) {
        this.activecompute = this.compute2.id
      } else if (this.compute3.active === true) {
        this.activecompute = this.compute3.id
      } else if (this.compute4.active === true) {
        this.activecompute = this.compute4.id
      }
    },
    filterVisActive () {
      if (this.vis1.active === true) {
        this.activevis = this.vis1.id
      } else if (this.vis2.active === true) {
        this.activevis = this.vis2.id
      }
    },
    addnewScience () {
      let scienceStart = {}
      scienceStart.formSeen = true
      this.contributeData = scienceStart
    },
    learnUpdate (uSeg) {
      console.log('update bundle')
      console.log(uSeg)
      let updateTbundle = {}
      let timeAsk = []
      timeAsk.push(uSeg.text)
      console.log(timeAsk)
      updateTbundle.timevis = timeAsk
      updateTbundle.startperiod = 'relative'
      updateTbundle.timeseg = []
      const nowTime = moment()
      let realTime = moment.utc(nowTime)
      let liveBundleUpdate = {}
      liveBundleUpdate.cnrl = this.liveBundle.cnrl
      liveBundleUpdate.language = this.liveBundle.language
      liveBundleUpdate.devices = this.liveBundle.devices
      liveBundleUpdate.datatypes = this.liveBundle.datatypes
      liveBundleUpdate.categories = this.liveBundle.categories
      liveBundleUpdate.science = this.liveBundle.science
      liveBundleUpdate.time = updateTbundle
      liveBundleUpdate.realtime = realTime
      liveBundleUpdate.resolution = this.liveBundle.resolution
      liveBundleUpdate.visualisation = this.liveBundle.visualisation
      this.learnStart(liveBundleUpdate)
    },
    learnListening () {
      var localthis = this
      // listening to give peer info. on computation statusTime
      this.liveSafeFlow.liveEManager.on('computation', function (cState) {
        console.log('computation event from manager')
        console.log(cState)
        if (cState === 'in-progress') {
          localthis.chartmessage.text = cState
        } else {
          localthis.chartmessage.text = 'computation up-to-date'
        }
      })
    },
    toolsSwitch (tss) {
      console.log('tools switch')
      console.log(tss)
      if (tss === true) {
        console.log(this.liveAnnotations)
        let updateCopyTemp = this.liveDataCollection
        this.liveDataCollection = {}
        let updateOptions = this.liveOptions
        updateOptions.annotation = this.liveAnnotations
        this.liveOptions = updateOptions
        console.log(this.liveOptions)
        this.liveDataCollection = updateCopyTemp
      } else if (tss === false) {
        this.liveOptions.annotation = {}
      }
    },
    saveStartBundle (bund) {
      console.log(' go and save via safeFLOW')
      this.liveSafeFlow.startSettings('save', bund)
    }
  }
}
</script>

<style>
#science {
  margin: 2em;
}

.science-start{
  font-weight: bold;
  font-size: 1.5em;
}

.science-part {
  font-weight: bold;
  font-size: 1em;
}

#description {
  margin: 1em;
}

#sensors {
  margin: 1em;
}

#sensors header {
  font-weight: bold;
}

#computations {
  margin: 1em;
}

#computations header {
  font-weight: bold;
}

#vis-sim {
  margin: 1em;
}

#vis-sim header {
  font-weight: bold;
}

#outcome-oracle {
  margin: 1em;
}

#outcome-oracle header {
  font-weight: bold;
}
</style>
