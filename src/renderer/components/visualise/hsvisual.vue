<template>
  <div id="visual-view">PAST
    <div id="diy-science">
      <div id="charts-live">
        <reactive :chartData="datacollection" :options="options" :width="1200" :height="600"></reactive>
      </div>
      <!-- <calendar-tool></calendar-tool>
      <multi-chart></multi-chart> -->
    </div>
  </div>
</template>

<script>
  // import LineChart from '@/components/charts/LineChart'
  // import BarChart from '@/components/charts/BarChart'
  // import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/visualise/charts/Reactive'
  import Reactivestats from '@/components/visualise/charts/Reactivestats'
  import calendarTool from '@/components/visualise/tools/calendarTool'
  import multiChart from '@/components/visualise/multiChart'
  // const moment = require('moment')

  export default {
    name: 'visual-liveview',
    components: {
      Reactive,
      Reactivestats,
      calendarTool,
      multiChart
    },
    props: {
      datacollection: {
        type: Object
      },
      options: {
        type: Object
      },
      navTime: {
        type: Array
      },
      makeTimeBundles: {
        type: Array
      },
      displayTime: '',
      tablecollection: {
        type: Object
      }
    },
    data () {
      return {
        toolbarData: {},
        recoveryData: {},
        datastatistics: null,
        liveChartoptions: null,
        visChartview: true,
        liveTime: '',
        timeVis: [],
        selectedExperiment: '',
        confirmAddE: '---'
      }
    },
    computed: {
    },
    created () {
    },
    mounted () {
    },
    methods: {
      toolsSwitch (ts) {
        ts.active = !ts.active
        if (ts.active === true) {
          this.toolbar.text = 'on'
          // need to add annotation to chart OPTIONS
          // this.$emit('toolsStatus', true)
        } else {
          this.toolbar.text = 'off'
          // remove the annotation from the chart OPTIONS
          // this.$emit('toolsStatus', false)
        }
      },
      recoveryStatus () {
        this.toolbar.text = 'off'
      },
      closeAvgSummary () {
        this.averageSeen = false
      },
      setTimeData (seg) {
        // back and forward and time
        this.$emit('updateLearn', seg)
      }
    }
  }
</script>

<style>
#visual-view {
  border: 2px solid green;
  margin: 0.0em;
  width: 100%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

#heart-chart {
  width: 1200px;
}

#heart-chart ul li {
  font-size: 1.1em;
}

.is-primary {
  font-size: 1.6em;
  margin-left: 12px;
}

#time-context {
  min-margin: 40px;
  text-align: center;
  border: 1px solid pink;
}

#visulation-select {
    border: 2px solid green;
    margin-left: 1em;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;
}

#learn-type {
  float: right;
}

.is-now {
  font-size: 1.6em;
  margin-left: 12px;
  color: green;
}

.is-future {
  font-size: 1.6em;
  margin-left: 12px;
  color: green;
}

#close-average {
  float: right;
}

.science-compute {
  font-size: 1.6em;
}

#view-time {
  margin-top: 10px;
  font-size: 1.4em;
}

#add-button {
  display: inline-block;
}

#charts-live {
  border: 0px solid red;
  width: 100%;
}

#time-calendar-tools {
  display: inline-block;
}

#additional-chart {
  border: 1px solid green;
}
</style>
