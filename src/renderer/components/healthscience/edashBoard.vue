<template>
  <div v-if="experimentDash && experimentDash.status === true && dashCNRL === experimentDash.cnrl" id="dashboard-view">
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
        let visEC = {}
        if (this.experimentDash) {
          visEC = await this.visDataPrepare()
          this.stopLiveProgress()
        }
        return visEC
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
      async visDataPrepare () {
        let entityArray = []
        let chartDataReady = {}
        let mappedExpENTs = this.$store.getters.liveKentities
        let currentEntities = this.$store.getters.startBundlesList
        let liveBundles = mappedExpENTs[this.experimentDash.cnrl]
        for (let expEB of liveBundles) {
          for (let iee of currentEntities) {
            if (expEB === iee.kbid) {
              console.log(iee)
              chartDataReady = await this.learnStart(iee)
              entityArray.push(chartDataReady)
            }
          }
        }
        return entityArray
      },
      makeLiveProgress () {
        this.entityPrepareStatus.active = true
      },
      stopLiveProgress () {
        this.entityPrepareStatus.active = false
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
  font-weight: bold;
  font-size: 1.4em;
}

</style>
