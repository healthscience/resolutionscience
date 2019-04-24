<template>
  <section class="container">
    <section id="knowledge">
      <knowledge-Live :liveData="liveData" ></knowledge-Live>
      <knowledge-Context :knowledgeData="knowledgeData" @knowledgeSet="knowledgeStatus" @languageSet="languageStatus"  @scienceSet="scienceStatus" @timeSet="timeStatus" @resolutionSet="resolutionStatus"></knowledge-Context>
    </section>
      <hsvisual :visualData="visualData" ></hsvisual>
    </section>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import hsvisual from '@/components/healthscience/hsvisual'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'
  import KnowledgeLive from '@/components/toolbar/knowledgeLive'

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
        knowledgeData: {},
        liveData:
        {
          devices: [],
          sensors: [],
          scienceLive: '',
          language: '',
          timeLive: [],
          resolutionLive: ''
        },
        visualData: {
          style: []
        },
        knowledge:
        {
          active: false,
          text: 'hiden'
        },
        liveTime: 0,
        selectedCompute: 'A',
        keyC: {},
        scoptions: [],
        options: {},
        averageSeen: false,
        labelback: [],
        heartback: [],
        colorback: '',
        colorlineback: '',
        devices: [],
        sensors: [],
        resolution: [],
        resolutionSet: '',
        sciencedataMapping: {},
        analysisStart: 0,
        analysisEnd: 0,
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        chartmessage: 'Select time',
        activedevice: [],
        activesensor: [],
        activeEntity: 'cnrl-2356388731',
        activeupdatecompute: '',
        activevis: '',
        activelearn: '',
        computeFlag: '',
        visChartview: true,
        visTableview: false,
        visSimview: false
      }
    },
    computed: {
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      system: function () {
        return this.$store.state.system
      },
      context: function () {
        return this.$store.state.context
      },
      science: function () {
        return this.$store.state.science
      },
      tools: function () {
        return this.$store.state.tools
      }
    },
    mounted () {
      this.knowledgeData.seenStatus = true
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
      setContextData (seg) {
        // get seg and then look at compute context and call appropriate
        const compContext = this.activeEntity
        if (compContext === 'cnrl-2356388731') {
          this.fillData(seg, {})
        }
      },
      toolsVis () {
        console.log('toolbar view')
        this.toolbar.text = 'on'
        /* let recoveryStart = {}
        recoveryStart.seenStatus = true
        this.recoveryData = recoveryStart */
        let toolbarStart = {}
        toolbarStart.seenStatus = true
        toolbarStart.liveOptions = this.liveChartoptions
        this.toolbarData = toolbarStart
        console.log(this.toolbarData)
      },
      timeRange () {
        let rangeHolder = {}
        rangeHolder.startTime = this.toolbarData.liveOptions.analysisStart
        rangeHolder.endTime = this.toolbarData.liveOptions.analysisEnd
        rangeHolder.active = true
        return rangeHolder
      },
      knowledgeStatus (kIN) {
        console.log('knowledtget set in')
        console.log(kIN)
        if (kIN.device_mac) {
          console.log('device live')
          this.liveDevice(kIN)
        } else if (kIN.text) {
          // datatypes
          this.liveDataTypes(kIN)
        }
      },
      languageStatus (lIN) {
        console.log('language set in')
        console.log(lIN)
        this.liveData.language = lIN
        console.log(this.liveData.language)
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
        this.liveData.devices = deviceLive
      },
      removeLiveElement (remove) {
        console.log('device remove')
        let array = this.liveData.devices
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.device_mac !== value
          })
        }
        let result = arrayRemove(array, remove)
        console.log(result)
        return true
      },
      liveDataTypes (liveDT) {
        console.log('set live DT')
        // let dataTypesLive = []
        if (liveDT.active === true) {
          console.log('true')
          this.liveData.sensors.push(liveDT)
        } else if (liveDT.active === false) {
          // remove device
          console.log('false')
          this.removeLiveDT(liveDT.text)
        }
        // this.liveData.sensors.push(dataTypesLive)
      },
      removeLiveDT (remove) {
        console.log('remove DT')
        let array = this.liveData.sensors
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.sensors = result
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
        this.liveData.timeLive.push(tIN.text)
      },
      resolutionStatus (rIN) {
        console.log('resolution set in')
        console.log(rIN)
        this.liveData.resolutionLive = rIN
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
