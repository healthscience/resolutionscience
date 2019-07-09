<template>
  <div v-if="experimentDash.status === true && dashCNRL === experimentDash.cnrl" id="dashboard-view">exp-- {{ experimentDash }}
    <header>Dashboard for experiment {{ experimentDash.cnrl }}</header>
    <div id="experiment-summary">
      <div class="summary-item" id="exerpiment-name"> Experiment: {{ experimentDash.contract.prime.text }} </div>
      <div class="summary-item" id="living-paper"> LivingPaper: {{ experimentDash.contract.livingpaper.link }} </div>
    </div>
    <learn-Report></learn-Report>
    <learn-Action></learn-Action>
    <progress-Message :progressMessage="entityPrepareStatus"></progress-Message>
    <ul>
      <li v-for="(vEnt, index) in makeKbundles">
        {{ index }}
        <expvisual :entityCNRL="vEnt.cnrl" :datacollection="vEnt.liveDataCollection" :options="vEnt.liveOptions" :displayTime="vEnt.liveTimeV"></expvisual>
      </li>
    </ul>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import progressMessage from '@/components/toolbar/inProgress'
  import learnReport from '@/components/reports/LearnReport'
  import learnAction from '@/components/reports/LearnAction'
  import expvisual from '@/components/healthscience/expVisual'

  export default {
    name: 'visual-liveview',
    components: {
      progressMessage,
      expvisual,
      learnReport,
      learnAction
    },
    props: {
      dashCNRL: '',
      experimentDash:
      {
        type: Object
      },
      liveDataCollection: {},
      liveOptions: {},
      liveTimeV: ''
    },
    data () {
      return {
        dashEstatus: false,
        experimentDash2: {},
        kbundlelive: {},
        entityPrepareStatus:
        {
          active: false,
          text: 'Preparing visualisation'
        }
      }
    },
    asyncComputed: {
      async makeKbundles () {
        // look up Kentitycomponents for this experiment per this Peer
        let mapEKentities = this.$store.getters.livemapExperimentKbundles
        console.log('mapped Exp to KBundles')
        console.log(mapEKentities)
        if (this.experimentDash.contract.kentities) {
          let makeEntity = await this.visDataPrepare(this.experimentDash.contract.kentities)
          return makeEntity
        }
      }
    },
    computed: {
    },
    created () {
    },
    mounted () {
      this.makeLiveProgress()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      async visDataPrepare (kentityIN) {
        console.log('prepare===================')
        console.log(kentityIN)
        let currentEntities = this.$store.getters.startBundlesList
        console.log('bundle list')
        console.log(currentEntities)
        let entityArray = []
        for (let ike of kentityIN) {
          console.log(ike)
          for (let iee of currentEntities) {
            if (ike === iee.kbid) {
              let chartDataReady = await this.learnStart(iee)
              console.log('chart data ready')
              console.log(chartDataReady)
              entityArray.push(chartDataReady)
            }
          }
        }
        this.entityPrepareStatus.active = false
        return entityArray
      },
      makeLiveProgress () {
        this.entityPrepareStatus.active = true
      }
    }
  }
</script>

<style>
#dashboard-view {
  border: 2px solid orange;
  margin: 2em;
  width: 98%;
}

header {
  font-weight: bold;
  margin-bottom: 12px;
}

.summary-item {
  display: inline-block;
  margin-left: 20px;
}

</style>
