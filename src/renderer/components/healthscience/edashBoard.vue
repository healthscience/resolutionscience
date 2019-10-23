<template>
  <div v-if="progressMessageIN && progressMessageIN.cnrl === dashCNRL" id="progess">
    <progress-Message :progressMessage="progressMessageIN"></progress-Message>
    <div v-if="experimentDash && experimentDash.status === true && dashCNRL === experimentDash.cnrl" id="dashboard-view">
      <header>Dashboard</header>
      <div id="experiment-summary">
        <div class="summary-item" id="exerpiment-name"> Experiment: {{ experimentDash.contract.prime.text }} </div>
        <div class="summary-item" id="living-paper">
          <a href="experimentDash.contract.livingpaper.link" >LivingPaper</a>
        </div>
      </div>
      <learn-Report></learn-Report>
      <learn-Action></learn-Action>
      <ul>
        <li v-for="(vEnt, index) in experimentDash.dashKBlist">
          <div id="dashboard-toolbar" >
            <ul>
              <li>
                Start: {{ chartUI.analysisStart }}
                <button v-model="peerChart" href="" id="add-exp-button" @click.prevent="setDashTime()">Sync Time Lines</button>
              </li>
              <li>
                End: {{ chartUI.analysisEnd }}
              </li>
            </ul>
          </div>
          <expvisual :entityCNRL="vEnt.cnrl" :datacollection="vEnt.liveDataCollection" :options="vEnt.liveOptions" :displayTime="vEnt.liveTimeV"></expvisual>
          <!-- <expfuturevisual :entityCNRL="vEnt.cnrl" :dataFcollection="{}" :optionsF="{}" :displayTimeF="{}"></expfuturevisual> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import progressMessage from '@/components/toolbar/inProgress'
  import learnReport from '@/components/reports/LearnReport'
  import learnAction from '@/components/reports/LearnAction'
  import expvisual from '@/components/healthscience/expVisual'
  import expfuturevisual from '@/components/healthscience/expfutureVisual'
  // const moment = require('moment')

  export default {
    name: 'visual-liveview',
    components: {
      progressMessage,
      expvisual,
      expfuturevisual,
      learnReport,
      learnAction
    },
    props: {
      dashCNRL: '',
      experimentDash:
      {
        type: Object
      },
      KBDash:
      {
        type: Object
      },
      progressMessageIN:
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
        peerChart: {},
        chartUI:
        {
          analysisStart: 'd----',
          analysisEnd: '---dd-'
        }
      }
    },
    computed: {
    },
    created () {
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      setDashTime () {
        console.log('set dashtime')
        // call action to update state
        this.updateChartOptions()
      },
      updateChartOptions () {
        let optState = {}
        optState.syncOptions = []
        optState.expCNRL = this.dashCNRL
        this.$store.dispatch('actionUpdateChartOptions', optState)
        console.log('chart action complete')
        // console.log()
      }
    }
  }
</script>

<style>
#dashboard-view {
  border: 2px solid white;
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
