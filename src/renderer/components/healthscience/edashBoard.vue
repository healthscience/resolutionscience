<template>
  <div v-if="experimentDash.cnrl" id="dashboard-view">exp-- {{ experimentDash }}
    <header>Dashboard for experiment {{ experimentDash.cnrl }}</header>
    <div id="experiment-summary">
      <div class="summary-item" id="exerpiment-name"> Experiment: {{ experimentDash.contract.prime.text }} </div>
      <div class="summary-item" id="living-paper"> LivingPaper: {{ experimentDash.contract.livingpaper.link }} </div>
    </div>
    <learn-Report></learn-Report>
    <learn-Action></learn-Action>
    <ul v-if="experimentDash.contract.kentities" > list {{ experimentDash.contract.kentities }}
      <li :counter="loopCounter()" v-for="(visentity, index) in experimentDash.contract.kentities" > {{ visentity }} {{ index}}
        <!--<progress-Message :counter="loopCounter()" :progressMessage="entityPrepareStatus"></progress-Message>-->
        <expvisual  :counter="loopCounterTWO()" :ddd="visDataPrepare(visentity)" :entityCNRL="visentity" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV"></expvisual>
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
      displayTime: '',
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
          active: true,
          text: 'Preparing visualisation'
        }
      }
    },
    computed: {
    },
    created () {
    },
    mounted () {
      // this.setExperimentList()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      loopCounter () {
        console.log('loop coutner')
      },
      loopCounterTWO () {
        console.log('loop coutnerTWO')
      },
      async visDataPrepare (kentityIN) {
        console.log('prepare===================')
        let currentEntities = this.$store.getters.startBundlesList // this.liveEntities
        console.log(currentEntities)
        let chartDataReady = {}
        let bundle = {}
        // loop over startBundles and match to kbundle cnrl
        for (let kbs of currentEntities) {
          console.log('ooping live Kbundles')
          console.log(kbs.kbid)
          console.log(kentityIN)
          if (kbs.kbid === kentityIN) {
            console.log('match')
            bundle = kbs
            this.kbundlelive = bundle
            this.entityPrepareStatus.active = true
            chartDataReady = await this.learnStart(bundle)
            console.log('chart data ready')
            console.log(chartDataReady)
            this.entityPrepareStatus.active = false
            this.liveDataCollection = chartDataReady.liveDataCollection
            this.liveOptions = chartDataReady.liveOptions
            this.liveTimeV = chartDataReady.kContext.liveTime
          }
        }
        return true
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
