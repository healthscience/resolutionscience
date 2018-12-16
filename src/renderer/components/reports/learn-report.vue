<template>
  <div v-if="reportData.learnSummarySeen" id="learn-report-summary">
    <header>Learn Summary</header>
    <div id="report-context">
      <div id="report-top">
        <div id="text-summary">Heart Rate Recovery Report
        </div>
        <div id="close-reportplacer">
          <button id="close-report" @click.prevent="closeRSummary()">Finsish & Close</button>
        </div>
      </div>
      <div id="report-bottom">
        <div id="analysis-layout">Activity: {{reportData.ridentity}}</div>
        <div id="analysis-layout">Heart Max: {{reportData.heartmax}}</div>
        <div id="analysis-layout">Heart Min: {{reportData.heartmin}}</div>
        <div id="analysis-layout">Recovery time: {{reportData.recovertime}}</div>
      </div>
      <div id="report-overtime">
        <div id="analysis-layout">Number similar: {{reportData.similarcount}}</div>
        <div id="analysis-layout">Recovery change: {{reportData.recoverchange}}</div>
        <div id="analysis-layout"><a href="" id="view-overtime-chart">Over time charts</a></div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'learn-report',
    components: {
    },
    props: {
      reportData: {
        type: Object
      }
    },
    data () {
      return {
        learnSummary: ''
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
        this.reportData.learnSummarySeen = false
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
