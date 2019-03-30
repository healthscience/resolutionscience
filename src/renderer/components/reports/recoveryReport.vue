<template>
  <div v-if="recoveryData.seenStatus" id="toolbar-view">
    Recovery report
    <div id="navigate-recovery">
      <header>RHR</header>
      <div id="close-recovery">
        <button id="save-recovery" @click.prevent="closeRecovery()">Close</button>
      </div>
    </div>
    <div id="report-context">
      <div id="report-top">
      </div>
      <div id="report-bottom">
        <div id="analysis-layout">Activity-step count: {{ reportLive.totalsteps }}</div>
        <div id="analysis-layout">Heart Rate Max: {{ reportLive.heartmax }}</div>
        <div id="analysis-layout">Heart Rate Min: {{ reportLive.heartmin }}</div>
        <div id="analysis-layout">Afer Average heart rate 2mins: {{ reportLive.recovertime }}</div>
        <div id="analysis-layout">Afer Average heart rate 5mins: {{ reportLive.recovertime }}</div>
        <div id="analysis-layout">Afer Average heart rate 10mins: {{ reportLive.recovertime }}</div>
      </div>
      <div id="report-overtime">
        <div id="analysis-layout">Number similar: {{ reportLive.similarcount }}</div>
        <div id="analysis-layout">Recovery change: {{ reportLive.recoverchange }}</div>
        <div id="analysis-layout"><a href="" id="view-overtime-chart">Over time charts</a></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'statistics-tools',
    components: {
    },
    props: {
      recoveryData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        liveTools: {},
        toolbarSummary: '',
        startPoint: 'none selected',
        endPoint: 'none selected'
      }
    },
    created () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      },
      reportLive: function () {
        return this.prepareReport(this.recoveryData.hrcdata)
      }
    },
    mounted () {
    },
    methods: {
      closeRecovery () {
        console.log('button pressed')
        this.recoveryData.seenStatus = false
        this.$emit('recoverySet', false)
      },
      prepareReport (reportIN) {
        // need to display first time interval (and tell if more intterval on this data pattern)
        // get last element of array
        // console.log(reportIN)
        // console.log(this.recoveryData.hrcdata)
        let lastReport = this.recoveryData.hrcdata.slice(-1)[0]
        let elements = Object.keys(lastReport)
        // console.log('key times')
        // console.log(lastReport)
        // console.log(elements)
        let firstTimeElement = elements[0]
        // console.log(firstTimeElement)
        let device = Object.keys(lastReport[firstTimeElement])
        // console.log(device)
        let lastReportData = lastReport[firstTimeElement][device[0]]
        // console.log(lastReportData)
        return lastReportData[0]
      }
    }
  }
</script>

<style>
#toolbar-view {
  margin: 20px;
  border: 1px solid grey;
}
#toolbar-view header {
  font-size: 1.4em;
}

#save-toolbar {
  float: right;
}

#tools {
  margin: 20px;
  border: 1px solid lightgrey;
}
</style>
