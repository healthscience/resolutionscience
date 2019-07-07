<template>
  <div v-if="eDashStatus === true" id="dashboard-view">
    <header>Dashboard for experiment {{ experimentDash.cnrl }}</header>
    <div id="experiment-summary">
      <div class="summary-item" id="exerpiment-name"> Experiment: {{ experimentDash.contract.prime.text }} </div>
      <div class="summary-item" id="living-paper"> LivingPaper: {{ experimentDash.contract.livingpaper.link }} </div>
    </div>
    <learn-Report></learn-Report>
    <learn-Action></learn-Action>
    <ul v-if="experimentDash.length !== 0" >
      <li v-for="visentity in experimentDash.contract.kentities" > {{ visentity }}
        <expvisual :entityCNRL="kbundlelive" :datacollection="visDataPrepare(visentity)" :options="liveOptions" :displayTime="liveTimeV"></expvisual>
      </li>
    </ul>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import learnReport from '@/components/reports/LearnReport'
  import learnAction from '@/components/reports/LearnAction'
  import expvisual from '@/components/healthscience/expVisual'
  export default {
    name: 'visual-liveview',
    components: {
      expvisual,
      learnReport,
      learnAction
    },
    props: {
      dashCNRL: '',
      displayTime: ''
    },
    data () {
      return {
        dashEstatus: false,
        kbundlelive: {}
      }
    },
    computed: {
      eDashStatus: function () {
        if (this.$store.state.experimentCNRL[this.dashCNRL]) {
          this.dashEstatus = this.$store.state.experimentCNRL[this.dashCNRL].status
          return this.dashEstatus
        } else {
          this.dashEstatus = false
          return this.dashEstatus
        }
      },
      experimentDash: function () {
        return this.$store.state.experimentCNRL[this.dashCNRL]
      },
      liveEntities: function () {
        return this.$store.state.startBundles
      }
    },
    created () {
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      visDataPrepare (kentityIN) {
        console.log('prepare date array for all the entities asked for')
        console.log(kentityIN)
        let bundle = {}
        // loop over startBundles and match to kbundle cnrl
        console.log('before looping')
        console.log(this.liveEntities)
        for (let kbs of this.liveEntities) {
          console.log('ooping live Kbundles')
          console.log(kbs.cnrl)
          console.log(kentityIN)
          if (kbs.cnrl === kentityIN) {
            console.log('match')
            bundle = kbs
          }
        }
        this.kbundlelive = bundle
        let chartDataReady = this.learnStart(bundle)
        this.liveOptions = {} // chartDataReady.options
        this.liveTimeV = {} // chartDataReady.liveTime
        return chartDataReady.datacollection
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
