<template>
  <section class="container">
    <section id="knowledge">
      <knowledge-Live :liveData="liveData" @liveLearn="learnStart" :liveExper="liveExper" @liveExperiments="experimentsStart"></knowledge-Live>
      <knowledge-Context :kContext="kContext" @setVDevice="deviceStatus" @setVDatatypes="datatypeStatus" @setVLanguage="languageStatus"  @setVScience="scienceStatus" @setVTime="timeStatus" @setVResolution="resolutionStatus"></knowledge-Context>
    </section>
    <hsvisual :datacollection="liveDataCollection" :options="liveOptions" @updateLearn="learnUpdate" @toolsStatus="toolsSwitch"></hsvisual>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import hsvisual from '@/components/healthscience/hsvisual'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'
  import KnowledgeLive from '@/components/toolbar/knowledgeLive'
  const moment = require('moment')

  export default {
    name: 'VueChartJS',
    components: {
      hsvisual,
      KnowledgeContext,
      KnowledgeLive
    },
    data () {
      return {
        liveSafeFlow: null,
        liveData:
        {
          devicesLive: [],
          datatypesLive: [],
          scienceLive: '',
          languageLive: '',
          timeLive: [],
          resolutionLive: ''
        },
        kContext: {},
        /* kContext: {
          startLine: 's',
          endLine: 'e'
        }, */
        liveDataCollection: {},
        liveOptions: {},
        liveAnnotations: {},
        liveSelectTime: 'ppp',
        liveanalysisStart: 'select',
        liveanalysisEnd: 'select',
        startLine: '',
        activeEntity: '',
        liveBundle: {},
        liveExper: []
      }
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
      // liveSelectTime: 'll'
    },
    mounted () {
    },
    created () {
      this.setAccess()
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      async getAverages (eid) {
        // update latest daily average HR
        let currentAHR = await this.liveSafeFlow.entityCurrentAverageHR(eid)
        console.log('averageHR current====')
        console.log(currentAHR)
        let newAHR = currentAHR // Math.floor(Math.random() * Math.floor(max))
        let newARHR = 55
        this.options.annotation.annotations[0].value = newAHR
        this.options.annotation.annotations[1].value = newARHR
      },
      timeRange () {
        let rangeHolder = {}
        rangeHolder.startTime = this.toolbarData.liveOptions.analysisStart
        rangeHolder.endTime = this.toolbarData.liveOptions.analysisEnd
        rangeHolder.active = true
        return rangeHolder
      },
      deviceStatus (dIN) {
        console.log('device set in')
        console.log(dIN)
        this.liveDevice(dIN)
      },
      liveDevice (liveD) {
        console.log('set live device to comp')
        let deviceLive = []
        if (liveD.active === true) {
          deviceLive.push(liveD)
        } else if (liveD.active === false) {
          // remove device
          this.removeLiveElement(liveD.device_mac)
        }
        this.liveData.devicesLive = deviceLive
      },
      removeLiveElement (remove) {
        console.log('device remove')
        let array = this.liveData.devicesLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.device_mac !== value
          })
        }
        let result = arrayRemove(array, remove)
        console.log(result)
        return true
      },
      datatypeStatus (ldt) {
        console.log('live datatypes')
        this.liveDataTypes(ldt)
      },
      liveDataTypes (liveDT) {
        console.log('set live DT')
        console.log(liveDT)
        if (liveDT.active === true) {
          console.log('true')
          this.liveData.datatypesLive.push(liveDT)
        } else if (liveDT.active === false) {
          // remove device
          console.log('false')
          this.removeLiveDT(liveDT.text)
        }
      },
      languageStatus (lIN) {
        console.log('language set in')
        console.log(lIN)
        this.liveData.languageLive = lIN
        console.log(this.liveData.languageLive)
      },
      removeLiveDT (remove) {
        console.log('remove DT')
        let array = this.liveData.datatypesLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.datatypesLive = result
        return true
      },
      scienceStatus (sIN) {
        console.log('science set in')
        console.log(sIN)
        this.liveData.scienceLive = sIN
      },
      timeStatus (tIN) {
        console.log('time set in')
        console.log(tIN)
        if (tIN.active === true) {
          console.log('true')
          this.liveData.timeLive.push(tIN.text)
        } else if (tIN.active === false) {
          // remove device
          console.log('false')
          this.removeLiveTime(tIN)
        }
      },
      removeLiveTime (trIN) {
        console.log('remove time')
        console.log(trIN)
        let removeTimeArr = this.liveData.timeLive.filter(item => item !== trIN.text)
        this.liveData.timeLive = removeTimeArr
      },
      resolutionStatus (rIN) {
        console.log('resolution set in')
        console.log(rIN)
        if (rIN.active === true) {
          console.log('true')
          this.liveData.resolutionLive = rIN.text
        } else if (rIN.active === false) {
          // remove device
          console.log('false')
          this.liveData.resolutionLive = ''
        }
      },
      async learnStart (lBundle) {
        console.log('start Learning')
        console.log(lBundle)
        this.liveBundle = lBundle
        this.activeEntity = this.liveData.scienceLive.cnrl
        this.activevis = this.$store.getters.liveVis[0]
        await this.liveSafeFlow.scienceEntities(lBundle)
        console.log('entity setup/operational')
        // this.learnListening()
        let entityGetter = await this.liveSafeFlow.entityGetter(this.activeEntity, this.activevis)
        console.log('VUE---return getter data')
        console.log(entityGetter)
        if (this.activevis === 'vis-sc-1') {
          console.log('chartjs')
          if (entityGetter.chartMessage === 'computation in progress') {
            console.log('chartjs--ongoing computation or obseration data')
            // this.chartmessage = entityGetter.chartMessage
            // this.options = entityGetter.chartPackage.options
            // this.datacollection = entityGetter.chartPackage.prepared
            // this.liveTime = entityGetter.chartPackage.livetime
            // this.getAverages(this.activeEntity)
          } else if (entityGetter.chartMessage === 'vis-report') {
            console.log('prepare report for HR recovery')
            let recoveryStart = {}
            recoveryStart.seenStatus = true
            recoveryStart.hrcdata = entityGetter.hrcReport
            this.recoveryData = recoveryStart
          } else {
            console.log('chartjs-- uptodate finised')
            console.log(entityGetter)
            this.chartmessage = 'computation up-to-date'
            this.options2 = entityGetter[0].liveChartOptions
            this.datacollection2 = entityGetter[0].chartPackage
            this.liveanalysisStart = entityGetter[0].selectTimeStart
            console.log('startline time')
            this.liveSelectTime = this.liveanalysisStart
            console.log(this.liveSelectTime)
            this.kContext = this.liveanalysisStart
            this.liveOptions = this.options2
            this.liveDataCollection = this.datacollection2
            // this.getAverages(this.activeEntity)
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
      async experimentsStart () {
        console.log('get experiments')
        this.liveExper = []
        let experimentList = this.liveSafeFlow.cnrlExperimentIndex()
        for (let exl of experimentList) {
          let expCNRL = this.liveSafeFlow.cnrlLookup(exl)
          this.liveExper.push(expCNRL)
        }
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
            localthis.chartmessage = cState
          } else {
            localthis.chartmessage = 'computation up-to-date'
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
      }
    }
  }
</script>

<style scoped>
a {
  color: #42b983;
}

.active{
  background-color:#8ec16d;
  color: white;
}

</style>
