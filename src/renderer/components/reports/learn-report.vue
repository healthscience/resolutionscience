<template>
  <div v-if="reportdata.reportSeen" id="learn-report-summary">
    live report
    <!--<header>Heart Rate Recovery</header>
    <div id="close-reportplacer">
      <button id="close-report" @click.prevent="closeRSummary()">Close</button>
    </div>
    <div id="report-context">
      <div id="report-top">
      </div>
      <div id="report-bottom">
        <div id="analysis-layout">Activity-step count: {{reportData.hrcdata.ridentity}}</div>
        <div id="analysis-layout">Heart Rate Max: {{reportData.hrcdata.heartmax}}</div>
        <div id="analysis-layout">Heart Rate Min: {{reportData.heartmin}}</div>
        <div id="analysis-layout">Afer Average heart rate 2mins: {{reportData.hrcdata.recovertime}}</div>
        <div id="analysis-layout">Afer Average heart rate 5mins: {{reportData.hrcdata.recovertime}}</div>
        <div id="analysis-layout">Afer Average heart rate 10mins: {{reportData.hrcdata.recovertime}}</div>
      </div>
      <div id="report-overtime">
        <div id="analysis-layout">Number similar: {{reportData.hrcdata.similarcount}}</div>
        <div id="analysis-layout">Recovery change: {{reportData.hrcdata.recoverchange}}</div>
        <div id="analysis-layout"><a href="" id="view-overtime-chart">Over time charts</a></div>
      </div>
    </div>-->
  </div>
</template>

<script>
  export default {
    name: 'learn-report',
    components: {
    },
    props: {
      reportData: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        reportSeen: false
      }
    },
    created () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    mounted () {
    },
    methods: {
      closeRSummary () {
        console.log('close report')
        this.reportSeen = false
      }
    }
  }
</script>

<style>
#learn-report-summary {
  border: 2px solid grey;
  margin: 40px;
}

#learn-report-summary header{
  font-size: 1.6em;
  font-weight: bolder;
}

#report-context {
  border: 1px solid grey;
  margin: 20px
}

#close-reportplacer {
  float: right;
}

#report-bottom {
  margin: 20px
}
</style>
