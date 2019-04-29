<template>
  <div id="live-view">
    <div id="live-knowledge-elements">
      <div v-if="liveData.language !== undefine" id="context-language" class="live-element">
        Language: <div class="live-item">{{ liveData.language.word }}</div>
      </div>
      <div v-else id="live-context-language" class="live-element">Please set</div>
      <div id="live-context-devices" class="live-element">
        <header>Devices:</header>
          <ul>
            <li v-for="dev in liveData.devices">
               <div class="live-item">{{ dev.device_name }}</div>
            </li>
          </ul>
      </div>
      <div id="live-context-datatypes" class="live-element">
        <header>DataTypes - </header>
          <ul>
            <li id="bmp-data-sensor" v-for="sen in liveData.sensors">
              <div class="live-item">{{ sen.text }}</div>
            </li>
          </ul>
      </div>
      <div v-if="liveData.scienceLive.prime !== undefine" id="live-context-science" class="live-element">
        Science - <div class="live-item">{{ liveData.scienceLive.prime.text || 'none' }}</div>
      </div>
      <div v-else id="live-context-science" class="live-element">Science: not selected</div>
      <div id="context-time" class="live-element">
        <header>Time:</header>
          <ul>
            <li v-for="ts in liveData.timeLive">
               <div class="live-item">{{ ts }}</div>
            </li>
          </ul>
      </div>
      <div id="context-resolution" class="live-element">
        <header>Resolution:</header>
          <div class="live-item">{{ liveData.resolutionLive }}</div>
      </div>
      <div id="live-learn" class="live-element">
        <div id="live-learn-container">
          <div id="learn">
            <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
          </div>
        </div>
      </div>
      <div id="learn-close"></div>
    </div>
  </div>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'

  export default {
    name: 'knowledge-live',
    components: {
    },
    props: {
      liveData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        live: {},
        liveSummary: '',
        datacollection: null,
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        liveSafeFlow: null,
        activeEntity: '',
        activevis: ''
      }
    },
    created () {
      this.liveData.seenStatus = true
      this.setAccess()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      },
      visulisation: function () {
        return this.$store.state.visualisation
      }
    },
    mounted () {
      this.startTools()
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      startTools () {
        this.liveTools = this.$store.getters.liveTools
      },
      async filterLearn (s) {
        console.log(s)
        const localthis = this
        // get language, device, datatypes and sci comp bundles
        // pass on to SAFEflow to pass on entity manager
        this.activeEntity = this.liveData.scienceLive.cnrl
        this.activevis = this.$store.getters.liveVis[0]
        let liveBundle = {}
        liveBundle.cnrl = this.liveData.scienceLive.cnrl
        liveBundle.language = this.liveData.language
        liveBundle.devices = this.liveData.devices
        liveBundle.datatypes = this.liveData.sensors
        liveBundle.science = this.liveData.scienceLive
        liveBundle.time = this.liveData.timeLive
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = this.$store.getters.liveVis
        this.saveLearnHistory(liveBundle)
        console.log(liveBundle)
        let entityBegin = await this.liveSafeFlow.scienceEntities(liveBundle)
        console.log('entity setup/operational')
        console.log(entityBegin)
        this.learnListening()
        let entityGetter = await this.liveSafeFlow.entityGetter(localthis.activeEntity, localthis.activevis)
        console.log('VUE---return getter data')
        if (localthis.activevis === 'vis-sc-1') {
          console.log('chartjs')
          if (entityGetter.chartMessage === 'computation in progress') {
            console.log('chartjs--ongoing computation or obseration data')
            localthis.chartmessage = entityGetter.chartMessage
            localthis.options = entityGetter.chartPackage.options
            localthis.$store.commit('setTools', localthis.options)
            localthis.datacollection = entityGetter.chartPackage.prepared
            localthis.liveTime = entityGetter.chartPackage.livetime
            localthis.liveChartoptions = entityGetter.liveChartOptions
            localthis.getAverages(localthis.activeEntity)
          } else if (entityGetter.chartMessage === 'vis-report') {
            console.log('prepare report for HR recovery')
            let recoveryStart = {}
            recoveryStart.seenStatus = true
            recoveryStart.hrcdata = entityGetter.hrcReport
            localthis.recoveryData = recoveryStart
          } else {
            console.log('chartjs-- uptodate finised')
            localthis.chartmessage = 'computation up-to-date'
            localthis.options = entityGetter.options
            localthis.$store.commit('setTools', localthis.options)
            localthis.datacollection = entityGetter.chartPackage.prepared
            localthis.liveTime = entityGetter.chartPackage.livetime
            localthis.liveChartoptions = entityGetter.chartPackage.options
            this.$store.commit('setVisualData', localthis.datacollection)
            this.$store.commit('setVisualOptions', localthis.liveChartoptions)
            this.$store.commit('setTeststring', 'james hi')
          }
          // console.log(localthis.datacollection)
        } else if (localthis.activevis === 'vis-sc-2') {
          console.log('tablejs')
          // localthis.tableHTML = entityGetter.table
        } else if (localthis.activevis === 'vis-sc-3') {
          console.log('simjs')
          // localthis.simulationHeart = entityGetter.heart
          // localthis.simulationMovement = entityGetter.heart
          // localthis.simulationTime = entityGetter.time
        }
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
      saveLearnHistory (lBundle) {
        console.log('save temp history or keep on network save')
      }
    }
  }
</script>

<style>
#live-view {
  border: 2px solid lightgrey;
  margin-left: 1em;
}

.live-element {
  float: left;
  min-width: 120px;
}

.live-item {
  font-weight: bold;
}
#learn-close {
  clear:both;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}
</style>
